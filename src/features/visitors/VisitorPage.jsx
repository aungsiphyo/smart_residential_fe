import React, { useEffect, useState } from "react";
import { fetchVisitors, registerVisitor } from "./api";
import VisitorList from "./components/VisitorList";
import VisitorForm from "./components/VisitorForm";
import Button from "../../components/ui/Button";

export default function VisitorPage() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchVisitors({ page, limit });
      const data = res?.data || res;
      setVisitors(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      console.error("Failed to load visitors", err.message || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page]);

  const handleRegister = async (payload) => {
    try {
      await registerVisitor(payload);
      setShowForm(false);
      load();
    } catch (err) {
      console.error("register failed", err.message || err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Visitors</h1>
          <p className="text-gray-500 text-sm mt-1">Visitor registrations and history</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setShowForm(true)}>+ Register Visitor</Button>
        </div>
      </div>

      {showForm ? (
        <div className="bg-white rounded-2xl border p-6">
          <VisitorForm onCancel={() => setShowForm(false)} onSubmit={handleRegister} />
        </div>
      ) : (
        <div>
          {loading ? <div className="p-8 text-center text-gray-500">Loading...</div> : <VisitorList visitors={visitors} onView={(v) => setSelected(v)} />}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-[16px] bg-white p-6 shadow-2xl border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{selected.fullname || `${selected.firstName} ${selected.lastName}`}</h3>
                <p className="text-sm text-gray-500">Badge: {selected.badgeNumber}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-gray-900">✕</button>
            </div>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <div><strong>Email:</strong> {selected.email || '—'}</div>
              <div><strong>Phone:</strong> {selected.phone || '—'}</div>
              <div><strong>Company:</strong> {selected.company || '—'}</div>
              <div><strong>Host:</strong> {selected.hostName || '—'}</div>
              <div><strong>Purpose:</strong> {selected.purpose || selected.purposeDetail || '—'}</div>
              <div><strong>Check-in:</strong> {selected.check_in_time ? new Date(selected.check_in_time).toLocaleString() : '—'}</div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
