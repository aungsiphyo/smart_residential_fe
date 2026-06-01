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
        // normalize to array
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
      // created shape may be { data } or direct
      const data = created?.data || created;
      setAlerts((prev) => [data, ...prev]);
      setManualOpen(false);
    } catch (err) {
      console.error("manual sos failed", err.message || err);
      // optionally show UI error
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">SOS Alerts</h1>
          <p className="text-gray-500 text-sm mt-1">Monitor emergency alerts and history.</p>
        </div>

        <div className="flex items-center gap-3">
          {!soundEnabled && <Button variant="secondary" onClick={enableSound}>Enable Sound</Button>}
          <Button onClick={() => setTab("active")} className={tab === "active" ? "bg-blue-600 text-white" : ""}>Active</Button>
          <Button onClick={() => setTab("history")} className={tab === "history" ? "bg-blue-600 text-white" : ""}>History</Button>
          <Button variant="danger" onClick={openManual}>+ Trigger Manual Alert</Button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-3 bg-white rounded-2xl border border-gray-200 px-4 py-2 shadow-sm w-full max-w-md">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search room, message or resident" className="w-full bg-transparent outline-none text-sm text-gray-700" />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading alerts...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No alerts found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs uppercase tracking-[0.12em] text-gray-500">
                <tr>
                  <th className="px-6 py-3">Room</th>
                  <th className="px-6 py-3">Caller / Resident</th>
                  <th className="px-6 py-3">Message</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Requested</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => (
                  <tr key={a._id || i} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4">{roomLabel(a)}</td>
                    <td className="px-6 py-4">{residentLabel(a)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{a.message || a.alert || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${a.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'}`}>
                        {a.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{a.created_at ? new Date(a.created_at).toLocaleString() : '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {a.status !== 'Resolved' && (
                          <Button size="sm" onClick={() => handleResolve(a)}>Resolve</Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => openDetails(a)}>View</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-[16px] bg-white p-6 shadow-2xl border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">Alert Details</h3>
                <p className="text-sm text-gray-500">Full details for the selected alert</p>
              </div>
              <button onClick={closeDetails} className="text-gray-500 hover:text-gray-900">✕</button>
            </div>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <div><strong>Type:</strong> {selectedAlert.type || selectedAlert.alert}</div>
              <div><strong>Resident:</strong> {residentLabel(selectedAlert) || 'Unknown'}</div>
              <div><strong>Location:</strong> {selectedAlert.location || selectedAlert.room || selectedAlert.room_id?.room_name || selectedAlert.room_id || 'Unknown'}</div>
              <div><strong>Status:</strong> {selectedAlert.status || 'Pending'}</div>
              <div className="md:col-span-2"><strong>Message:</strong> {selectedAlert.message || selectedAlert.alert || '-'}</div>
              <div><strong>Created:</strong> {selectedAlert.created_at ? new Date(selectedAlert.created_at).toLocaleString() : '-'}</div>
              {selectedAlert.resolved_at && <div><strong>Resolved:</strong> {new Date(selectedAlert.resolved_at).toLocaleString()}</div>}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="secondary" onClick={closeDetails}>Close</Button>
              {selectedAlert.status !== 'Resolved' && <Button onClick={() => { handleResolve(selectedAlert); closeDetails(); }}>Mark Resolved</Button>}
            </div>
          </div>
        </div>
      )}

      {manualOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-[16px] bg-white p-6 shadow-2xl border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">Trigger Manual SOS</h3>
                <p className="text-sm text-gray-500">Create a test/manual SOS alert</p>
              </div>
              <button onClick={() => setManualOpen(false)} className="text-gray-500 hover:text-gray-900">✕</button>
            </div>

            <form onSubmit={submitManual} className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium">Room ID</label>
                <input value={manualForm.room_id} onChange={(e) => setManualForm((s) => ({ ...s, room_id: e.target.value }))} className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium">Resident ID (optional)</label>
                <input value={manualForm.resident} onChange={(e) => setManualForm((s) => ({ ...s, resident: e.target.value }))} className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium">Message</label>
                <textarea value={manualForm.message} onChange={(e) => setManualForm((s) => ({ ...s, message: e.target.value }))} className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none" />
              </div>

              <div className="flex justify-end gap-2">
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
