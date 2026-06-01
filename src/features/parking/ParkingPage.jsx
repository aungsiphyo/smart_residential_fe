import React, { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import Button from "../../components/ui/Button";
import { fetchParking, patchParkingDelta, patchParkingReset } from "./api";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5001";

const TYPE_META = {
  resident: {
    label: "Residential Parking",
    accent: "from-sky-500 to-indigo-600",
    emoji: "🏘️",
  },
  visitor: {
    label: "Visitor Parking",
    accent: "from-emerald-500 to-teal-600",
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
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-[28px] bg-white p-6 shadow-sm border border-slate-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Parking dashboard</p>
              <h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">Visitor & resident parking</h1>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              <p className="text-sm text-slate-600">Live updates from backend + sockets</p>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                live sync {socketRef.current?.connected ? "on" : "connecting"}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Total capacity</p>
              <p className="mt-2 text-3xl font-black text-slate-900">{totals.totalSlot}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Available slots</p>
              <p className="mt-2 text-3xl font-black text-slate-900">{totals.availableSlot}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Current occupancy</p>
              <p className="mt-2 text-3xl font-black text-slate-900">{totals.occupancy}%</p>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          {parkingData.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 shadow-sm">
              Loading parking data...
            </div>
          ) : (
            parkingData.map((item) =>{
              const meta = TYPE_META[item.type] || {};
              const usable = Math.max(Number(item.totalSlot || 0) - Number(item.maintenanceSlot || 0), 0);
              const progress = usable > 0 ? clampPercent((Number(item.usedSlot || 0) / usable) * 100) : 0;

              return (
                <article key={item.type} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{meta.label}</p>
                      <h2 className="mt-2 text-2xl font-extrabold text-slate-900">{item.type === "resident" ? "Residential" : "Visitor"}</h2>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-100 text-2xl">
                      {meta.emoji}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Total</p>
                      <p className="mt-2 text-2xl font-black text-slate-900">{item.totalSlot}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Available</p>
                      <p className="mt-2 text-2xl font-black text-slate-900">{item.availableSlot}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Used</p>
                      <p className="mt-2 text-2xl font-black text-slate-900">{item.usedSlot}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Maintenance</p>
                      <p className="mt-2 text-2xl font-black text-slate-900">{item.maintenanceSlot}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <span>Usable slots</span>
                      <span>{usable}</span>
                    </div>
                    <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${item.type === "resident" ? "from-sky-500 to-indigo-500" : "from-emerald-500 to-teal-500"}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="mt-3 text-xs text-slate-500">{progress}% of usable slots occupied</p>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
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
                      variant="danger"
                      size="md"
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
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Recent activity</p>
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <p>{lastEvent ? `${lastEvent.type} parking updated ${new Date(lastEvent.timestamp).toLocaleTimeString()}` : "No recent updates yet."}</p>
              <p className="text-slate-500">Actions sync immediately to the backend and broadcast live.</p>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Live status</p>
              <div className="mt-4 flex items-center justify-between gap-3 rounded-3xl bg-slate-50 p-4">
                <span className="text-sm font-medium text-slate-700">Socket</span>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">{socketRef.current?.connected ? "Connected" : "Connecting"}</span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 rounded-3xl bg-slate-50 p-4">
                <span className="text-sm font-medium text-slate-700">State</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">{busy ? "Saving" : "Ready"}</span>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-5 shadow-sm text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">Quick tips</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                <li>• Use visitor and resident cards separately.</li>
                <li>• Adjust counts with check-in/check-out.</li>
                <li>• Reset only after verifying actual state.</li>
              </ul>
            </div>
          </aside>
        </div>

        {error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading && (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
            Loading parking dashboard...
          </div>
        )}
      </div>
    </div>
  );
}