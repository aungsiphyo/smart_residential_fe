import React, { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import Button from "../../components/ui/Button";
import { fetchParking, patchParkingDelta, patchParkingReset } from "./api";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5001";

const TYPE_META = {
  resident: {
    label: "Residential Parking",
    emoji: "🏘️",
  },
  visitor: {
    label: "Visitor Parking",
    emoji: "🚗",
  },
};

const clampPercent = (value) => Math.min(100, Math.max(0, Math.round(value)));

export default function ParkingPage() {
  const [parkingData, setParkingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [lastEvent, setLastEvent] = useState(null);
  const socketRef = useRef(null);

  const loadParking = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetchParking();
      setParkingData(response.data?.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Unable to load parking status.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParking();
  }, []);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on("connect", () => {
      console.debug("Parking socket connected", socket.id);
    });

    socket.on("parking_update", (payload) => {
      setParkingData((prev) => {
        const next = prev.map((item) =>
          item.type === payload.type ? payload : item,
        );

        if (!next.some((item) => item.type === payload.type)) {
          next.push(payload);
        }

        return next;
      });

      setLastEvent({
        ...payload,
        action: payload.usedSlot >= payload.availableSlot ? "Updated" : "Updated",
        timestamp: new Date().toISOString(),
      });
    });

    socket.on("connect_error", (err) => {
      console.warn("Parking socket connection failed:", err.message);
    });

    return () => {
      socket.off("connect");
      socket.off("parking_update");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, []);

  const totals = useMemo(() => {
    const totalSlot = parkingData.reduce(
      (sum, item) => sum + Number(item.totalSlot || 0),
      0,
    );
    const usedSlot = parkingData.reduce(
      (sum, item) => sum + Number(item.usedSlot || 0),
      0,
    );
    const maintenanceSlot = parkingData.reduce(
      (sum, item) => sum + Number(item.maintenanceSlot || 0),
      0,
    );
    const availableSlot = parkingData.reduce(
      (sum, item) => sum + Number(item.availableSlot || 0),
      0,
    );

    return {
      totalSlot,
      usedSlot,
      maintenanceSlot,
      availableSlot,
      occupancy:
        totalSlot > 0
          ? clampPercent((usedSlot / Math.max(totalSlot - maintenanceSlot, 1)) * 100)
          : 0,
    };
  }, [parkingData]);

  const updateParking = async (type, delta) => {
    setBusy(true);
    setError("");

    try {
      const response = await patchParkingDelta(type, delta);
      const updated = response.data?.data;
      if (!updated) {
        throw new Error("Server did not return updated parking data.");
      }
      setParkingData((prev) =>
        prev.map((item) => (item.type === updated.type ? updated : item)),
      );
      setLastEvent({
        ...updated,
        action: delta === 1 ? "Check-in" : "Check-out",
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Unable to update parking counts.",
      );
    } finally {
      setBusy(false);
    }
  };

  const resetParking = async (type) => {
    setBusy(true);
    setError("");

    try {
      const response = await patchParkingReset(type);
      const updated = response.data?.data;
      if (!updated) {
        throw new Error("Server did not return reset parking data.");
      }
      setParkingData((prev) =>
        prev.map((item) => (item.type === updated.type ? updated : item)),
      );
      setLastEvent({
        ...updated,
        action: "Reset",
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Unable to reset parking counts.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="rounded-lg bg-[#0e1422] p-6 border border-slate-800">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Parking dashboard</p>
            <h1 className="mt-1 text-2xl font-bold text-white tracking-tight">Visitor & Resident Parking</h1>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <p className="text-xs font-medium text-slate-400">Live updates from building gates</p>
            <div className="inline-flex items-center gap-2 rounded-lg bg-slate-900 border border-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">
              <span className={`h-2 w-2 rounded-full ${socketRef.current?.connected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
              live sync {socketRef.current?.connected ? "on" : "connecting"}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total capacity</p>
            <p className="mt-2 text-2xl font-bold text-white font-mono">{totals.totalSlot}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Available slots</p>
            <p className="mt-2 text-2xl font-bold text-white font-mono">{totals.availableSlot}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current occupancy</p>
            <p className="mt-2 text-2xl font-bold text-white font-mono">{totals.occupancy}%</p>
          </div>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        {parkingData.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-800 bg-[#0e1422] p-12 text-center text-slate-400 font-medium">
            Loading parking data...
          </div>
        ) : (
          parkingData.map((item) => {
            const meta = TYPE_META[item.type] || {};
            const usable = Math.max(Number(item.totalSlot || 0) - Number(item.maintenanceSlot || 0), 0);
            const progress = usable > 0 ? clampPercent((Number(item.usedSlot || 0) / usable) * 100) : 0;

            return (
              <article key={item.type} className="rounded-lg border border-slate-800 bg-[#0e1422] p-6 transition duration-200">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{meta.label}</p>
                    <h2 className="mt-1 text-xl font-bold text-white tracking-tight">{item.type === "resident" ? "Residential" : "Visitor"}</h2>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-xl">
                    {meta.emoji}
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 font-mono">
                  <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans">Total</p>
                    <p className="mt-1 text-lg font-bold text-white">{item.totalSlot}</p>
                  </div>
                  <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans">Available</p>
                    <p className="mt-1 text-lg font-bold text-white">{item.availableSlot}</p>
                  </div>
                  <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans">Used</p>
                    <p className="mt-1 text-lg font-bold text-white">{item.usedSlot}</p>
                  </div>
                  <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans">Maintenance</p>
                    <p className="mt-1 text-lg font-bold text-white">{item.maintenanceSlot}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>Usable slots</span>
                    <span className="font-mono">{usable} Slots</span>
                  </div>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-900 border border-slate-800">
                    <div
                      className={`h-full rounded-full bg-blue-700`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="mt-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">{progress}% of usable slots occupied</p>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <Button
                    variant="primary"
                    size="md"
                    disabled={busy}
                    onClick={() => updateParking(item.type, 1)}
                  >
                    + Check-in
                  </Button>
                  <Button
                    variant="secondary"
                    size="md"
                    disabled={busy}
                    onClick={() => updateParking(item.type, -1)}
                  >
                    - Check-out
                  </Button>
                  <Button
                    variant="ghost"
                    size="md"
                    className="border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200"
                    disabled={busy}
                    onClick={() => resetParking(item.type)}
                  >
                    Reset
                  </Button>
                </div>
              </article>
            );
          })
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-lg border border-slate-800 bg-[#0e1422] p-6">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4">Recent activity</p>
          <div className="space-y-3 text-sm text-slate-300 font-semibold">
            <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-4 font-semibold text-slate-200">
              {lastEvent ? `${lastEvent.type === "resident" ? "Resident" : "Visitor"} parking updated ${new Date(lastEvent.timestamp).toLocaleTimeString()}` : "No recent updates yet."}
            </div>
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">
              Actions sync immediately to the backend and broadcast live.
            </p>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-lg border border-slate-800 bg-[#0e1422] p-6">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4">Live status</p>
            <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-800/40 bg-slate-900/40 p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Socket</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border inline-flex items-center justify-center ${socketRef.current?.connected ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse"}`}>
                {socketRef.current?.connected ? "Connected" : "Connecting"}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-slate-800/40 bg-slate-900/40 p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">State</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border inline-flex items-center justify-center ${busy ? "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"}`}>
                {busy ? "Saving" : "Ready"}
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-6 text-slate-300">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4">Quick tips</p>
            <ul className="space-y-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <li>• Use visitor and resident cards separately</li>
              <li>• Adjust counts with check-in/check-out</li>
              <li>• Reset only after verifying actual state</li>
            </ul>
          </div>
        </aside>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4.5 text-sm font-semibold text-red-400">
          ⚠️ {error}
        </div>
      )}
      {loading && (
        <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-6 text-center text-slate-400 font-semibold animate-pulse">
          Loading parking dashboard...
        </div>
      )}
    </div>
  );
}