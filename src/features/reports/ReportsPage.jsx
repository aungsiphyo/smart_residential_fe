import React, { useEffect, useRef, useState } from "react";
import Button from "../../components/ui/Button";
import { fetchReports, createReport, updateReport } from "./api";
import ReportList from "./components/ReportList";
import ReportForm from "./components/ReportForm";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5001";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState(null);
  const socketRef = useRef(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchReports();
      const data = res?.data || res;
      setReports(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      console.error("Failed to load reports", err.message || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    socketRef.current = new WebSocket(SOCKET_URL.replace(/^http/, "ws") + "/socket.io/?EIO=4&transport=websocket");
    const ws = socketRef.current;

    ws.addEventListener("message", () => {
      load();
    });

    return () => {
      try { ws.close(); } catch (e) {}
    };
  }, []);

  const handleCreate = async (payload) => {
    try {
      await createReport(payload);
      setShowCreate(false);
      load();
    } catch (err) {
      console.error("create report failed", err.message || err);
    }
  };

  const handleUpdate = async (id, payload) => {
    try {
      await updateReport(id, payload);
      setEditing(null);
      load();
    } catch (err) {
      console.error("update failed", err.message || err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Reports</h1>
          <p className="text-gray-500 text-sm mt-1">View and manage resident reports</p>
        </div>
        <div className="flex items-center gap-3" />
      </div>

      {showCreate && (
        <div className="bg-white rounded-2xl border p-6">
          <ReportForm onCancel={() => setShowCreate(false)} onSubmit={handleCreate} />
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-gray-500">Loading reports...</div>
      ) : (
        <ReportList reports={reports} onView={(r) => setEditing(r)} onUpdate={(r) => setEditing(r)} />
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-[16px] bg-white p-6 shadow-2xl border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">Edit Report</h3>
                <p className="text-sm text-gray-500">Update status or details</p>
              </div>
              <button onClick={() => setEditing(null)} className="text-gray-500 hover:text-gray-900">✕</button>
            </div>

            <ReportForm initial={editing} onCancel={() => setEditing(null)} onSubmit={(data) => handleUpdate(editing._id, data)} />
          </div>
        </div>
      )}
    </div>
  );
}
