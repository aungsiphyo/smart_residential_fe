import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Button from "../../components/ui/Button";
import { createSosAlert, getSosAlerts, updateSosAlert } from "./api";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5001";

export default function SosAlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [resolvedAlerts, setResolvedAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("active");
  const [search, setSearch] = useState("");
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [manualOpen, setManualOpen] = useState(false);
  const [manualSubmitting, setManualSubmitting] = useState(false);
  const [manualForm, setManualForm] = useState({ room_id: "", resident: "", message: "" });
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioRef = useRef(new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg"));

  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);
    const socket = socketRef.current;

    socket.on("sos_alert", (data) => {
      setAlerts((prev) => {
        const exists = prev.some((a) => (a._id && data._id && a._id === data._id) || (a.room === data.room && a.created_at === data.created_at));
        if (exists) return prev;
        if (soundEnabled) audioRef.current.play().catch(() => {});
        return [data, ...prev];
      });
    });

    socket.on("sos_control", (update) => {
      if (update?.action === "RESOLVE") {
        setAlerts((prev) => prev.filter((a) => (a._id ? a._id !== update._id : a !== update)));
        setResolvedAlerts((prev) => [
          { ...update, status: "Resolved", resolved_at: update.resolved_at || new Date().toISOString() },
          ...prev,
        ]);
      }
    });

    return () => {
      socket.off("sos_alert");
      socket.off("sos_control");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [soundEnabled]);

  useEffect(() => {
    const loadAlerts = async () => {
      setLoading(true);
      try {
        const status = tab === "active" ? "Active" : "Resolved";
        const raw = await getSosAlerts({ status });
        const data = raw?.data || raw;
        const arr = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];

        if (tab === "active") {
          setAlerts(arr);
        }

        if (tab === "history") {
          setResolvedAlerts(arr);
        }
      } catch (err) {
        console.error("Failed to load SOS alerts", err.message || err);
      } finally {
        setLoading(false);
      }
    };

    loadAlerts();
  }, [tab]);

  const displayedAlerts = (() => {
    const sel = tab === "active" ? alerts : resolvedAlerts;
    return Array.isArray(sel) ? sel : [];
  })();

  const renderText = (value) => {
    if (value == null) return "";
    if (typeof value === "object") {
      if (typeof value.fullname === "string" && value.fullname) return value.fullname;
      if (typeof value.fullName === "string" && value.fullName) return value.fullName;
      if (typeof value.email === "string" && value.email) return value.email;
      if (typeof value.phone === "string" && value.phone) return value.phone;
      if (typeof value.room_name === "string" && value.room_name) return value.room_name;
      if (typeof value.name === "string" && value.name) return value.name;
      if (typeof value._id === "string" && Object.keys(value).length === 1) return value._id;
      return JSON.stringify(value);
    }
    return String(value);
  };

  const roomLabel = (item) => renderText(item.room) || renderText(item.room_id) || "—";
  const residentLabel = (item) =>
    renderText(item.resident) ||
    renderText(item.caller) ||
    renderText(item.resident_id) ||
    "—";

  const filtered = displayedAlerts.filter((a) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      roomLabel(a).toLowerCase().includes(q) ||
      String(a.message || a.alert || "").toLowerCase().includes(q) ||
      residentLabel(a).toLowerCase().includes(q)
    );
  });

  const handleResolve = async (alert) => {
    try {
      await updateSosAlert(alert._id, { status: "Resolved", resolved_at: new Date().toISOString() });
    } catch (err) {
      console.error("Failed to resolve SOS alert", err.message || err);
    }

    socketRef.current?.emit("sos_control", { ...alert, action: "RESOLVE" });
    setAlerts((prev) => prev.filter((a) => (a._id ? a._id !== alert._id : a !== alert)));
    setResolvedAlerts((prev) => [
      { ...alert, status: "Resolved", resolved_at: new Date().toISOString() },
      ...prev,
    ]);
  };

  const openManual = () => {
    setManualForm({ room_id: "", resident: "", message: "" });
    setManualOpen(true);
  };

  const submitManual = async (e) => {
    e.preventDefault();
    setManualSubmitting(true);
    try {
      const payload = {
        resident_id: manualForm.resident || null,
        room_id: manualForm.room_id || null,
        message: manualForm.message || "Manual SOS",
      };
      const created = await createSosAlert(payload);
      const data = created?.data || created;
      setAlerts((prev) => [data, ...prev]);
      setManualOpen(false);
    } catch (err) {
      console.error("manual sos failed", err.message || err);
    } finally {
      setManualSubmitting(false);
    }
  };

  const openDetails = (alert) => setSelectedAlert(alert);
  const closeDetails = () => setSelectedAlert(null);

  const enableSound = () => {
    audioRef.current.play().then(() => {
      audioRef.current.pause();
      setSoundEnabled(true);
    }).catch(() => setSoundEnabled(true));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">SOS Alerts</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Monitor emergency alerts and system response history.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {!soundEnabled && <Button variant="secondary" onClick={enableSound}>Enable Sound</Button>}
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-1">
            <button
              type="button"
              onClick={() => setTab("active")}
              className={`rounded-md px-4.5 py-1.5 text-sm font-semibold transition-all cursor-pointer ${tab === "active" ? "bg-blue-700 text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 hover:bg-slate-800/40"}`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => setTab("history")}
              className={`rounded-md px-4.5 py-1.5 text-sm font-semibold transition-all cursor-pointer ${tab === "history" ? "bg-blue-700 text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 hover:bg-slate-800/40"}`}
            >
              History
            </button>
          </div>
          <Button variant="danger" onClick={openManual}>+ Trigger Manual Alert</Button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0e1422] rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden p-6">
        <div className="flex items-center gap-3 mb-6">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search room, message or resident..."
            className="w-full sm:w-80 px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900/40 outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 text-sm font-semibold transition text-slate-800 dark:text-slate-200 placeholder-slate-500"
          />
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-medium animate-pulse">Loading alerts...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-medium">No alerts found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-[10px] font-bold font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3">ROOM</th>
                  <th className="px-6 py-3">CALLER / RESIDENT</th>
                  <th className="px-6 py-3">MESSAGE</th>
                  <th className="px-6 py-3">STATUS</th>
                  <th className="px-6 py-3">REQUESTED</th>
                  <th className="px-6 py-3 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                {filtered.map((a, i) => (
                  <tr key={a._id || i} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors text-sm">
                    <td className="px-6 py-4.5 text-slate-900 dark:text-white font-semibold">{roomLabel(a)}</td>
                    <td className="px-6 py-4.5 text-slate-900 dark:text-white font-semibold">{residentLabel(a)}</td>
                    <td className="px-6 py-4.5 font-medium text-slate-700 dark:text-slate-300">{a.message || a.alert || '-'}</td>
                    <td className="px-6 py-4.5">
                      <span className={`inline-flex rounded px-2 py-0.5 text-[10px] font-bold border items-center justify-center ${a.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse'}`}>
                        {a.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-slate-500 dark:text-slate-400 font-semibold font-mono">{a.created_at ? new Date(a.created_at).toLocaleString() : '-'}</td>
                    <td className="px-6 py-4.5 text-right flex justify-end gap-2">
                      {a.status !== 'Resolved' && (
                        <Button size="sm" onClick={() => handleResolve(a)}>Resolve</Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => openDetails(a)}>View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg rounded-xl bg-white dark:bg-[#0e1422] p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Alert Details</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Full details for the selected emergency SOS alert</p>
              </div>
              <button onClick={closeDetails} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 font-bold text-lg cursor-pointer">✕</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/40 p-5 rounded-lg border border-slate-200 dark:border-slate-800 font-medium text-slate-700 dark:text-slate-300">
              <div>
                <strong className="text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider block mb-1">Type</strong>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedAlert.type || selectedAlert.alert || "SOS Emergency"}</span>
              </div>
              <div>
                <strong className="text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider block mb-1">Resident</strong>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{residentLabel(selectedAlert) || 'Unknown'}</span>
              </div>
              <div>
                <strong className="text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider block mb-1">Location</strong>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedAlert.location || selectedAlert.room || selectedAlert.room_id?.room_name || selectedAlert.room_id || 'Unknown'}</span>
              </div>
              <div>
                <strong className="text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider block mb-1">Status</strong>
                <div>
                  <span className={`inline-flex rounded px-2 py-0.5 text-[10px] font-bold border items-center justify-center ${selectedAlert.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse'}`}>
                    {selectedAlert.status || 'Active'}
                  </span>
                </div>
              </div>
              <div className="sm:col-span-2">
                <strong className="text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider block mb-1.5">Message</strong>
                <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg p-4 text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
                  {selectedAlert.message || selectedAlert.alert || '-'}
                </div>
              </div>
              <div>
                <strong className="text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider block mb-1">Created</strong>
                <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono text-xs">{selectedAlert.created_at ? new Date(selectedAlert.created_at).toLocaleString() : '-'}</span>
              </div>
              {selectedAlert.resolved_at && (
                <div>
                  <strong className="text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider block mb-1">Resolved</strong>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono text-xs">{new Date(selectedAlert.resolved_at).toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2.5 border-t border-slate-200 dark:border-slate-800 pt-4">
              <Button variant="secondary" onClick={closeDetails}>Close</Button>
              {selectedAlert.status !== 'Resolved' && <Button onClick={() => { handleResolve(selectedAlert); closeDetails(); }}>Mark Resolved</Button>}
            </div>
          </div>
        </div>
      )}

      {manualOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg rounded-xl bg-white dark:bg-[#0e1422] p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Trigger Manual SOS</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Create a test or manual emergency SOS alert</p>
              </div>
              <button onClick={() => setManualOpen(false)} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 font-bold text-lg cursor-pointer">✕</button>
            </div>

            <form onSubmit={submitManual} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Room ID</label>
                <input required value={manualForm.room_id} onChange={(e) => setManualForm((s) => ({ ...s, room_id: e.target.value }))} className="w-full rounded-lg border border-slate-200 dark:border-slate-800 px-3.5 py-2 outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition text-slate-800 dark:text-slate-200 font-semibold bg-slate-50 dark:bg-slate-900/40 focus:bg-slate-50 dark:bg-slate-900/60 placeholder-slate-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Resident ID (optional)</label>
                <input value={manualForm.resident} onChange={(e) => setManualForm((s) => ({ ...s, resident: e.target.value }))} className="w-full rounded-lg border border-slate-200 dark:border-slate-800 px-3.5 py-2 outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition text-slate-800 dark:text-slate-200 font-semibold bg-slate-50 dark:bg-slate-900/40 focus:bg-slate-50 dark:bg-slate-900/60 placeholder-slate-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Message</label>
                <textarea required rows={3} value={manualForm.message} onChange={(e) => setManualForm((s) => ({ ...s, message: e.target.value }))} className="w-full rounded-lg border border-slate-200 dark:border-slate-800 px-3.5 py-2 outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition text-slate-800 dark:text-slate-200 font-semibold bg-slate-50 dark:bg-slate-900/40 focus:bg-slate-50 dark:bg-slate-900/60 placeholder-slate-500 min-h-[80px]" />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <Button variant="secondary" type="button" onClick={() => setManualOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={manualSubmitting}>{manualSubmitting ? 'Sending...' : 'Send Alert'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
