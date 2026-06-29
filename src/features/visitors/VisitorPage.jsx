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
          <h1 className="text-2xl font-bold tracking-tight text-white">Visitors</h1>
          <p className="text-slate-400 text-sm mt-1">Visitor registrations and history</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setShowForm(true)}>+ Register Visitor</Button>
        </div>
      </div>

      {showForm ? (
        <div className="bg-[#0e1422] rounded-lg border border-slate-800 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white tracking-tight">Register Visitor</h2>
            <p className="text-slate-400 text-sm mt-1 font-medium">Please provide credential details below.</p>
          </div>
          <VisitorForm onCancel={() => setShowForm(false)} onSubmit={handleRegister} />
        </div>
      ) : (
        <div>
          {loading ? (
            <div className="p-12 text-center text-slate-400 font-medium animate-pulse bg-[#0e1422] rounded-lg border border-slate-800">
              Loading visitor data...
            </div>
          ) : (
            <VisitorList visitors={visitors} onView={(v) => setSelected(v)} />
          )}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg rounded-xl bg-[#0e1422] p-6 border border-slate-800 shadow-lg">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">{selected.fullname || `${selected.firstName} ${selected.lastName}`}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5 font-mono">Badge: {selected.badgeNumber || "—"}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-200 font-bold text-sm cursor-pointer">✕</button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm text-slate-300 bg-slate-900/30 p-5 rounded-lg border border-slate-800 font-medium">
              <div><strong className="text-slate-400 uppercase text-[10px] tracking-wider block mb-1">Email</strong> {selected.email || '—'}</div>
              <div><strong className="text-slate-400 uppercase text-[10px] tracking-wider block mb-1">Phone</strong> {selected.phone || '—'}</div>
              <div><strong className="text-slate-400 uppercase text-[10px] tracking-wider block mb-1">Company</strong> {selected.company || '—'}</div>
              <div><strong className="text-slate-400 uppercase text-[10px] tracking-wider block mb-1">Host</strong> {selected.hostName || '—'}</div>
              <div className="sm:col-span-2"><strong className="text-slate-400 uppercase text-[10px] tracking-wider block mb-1">Purpose</strong> {selected.purpose || selected.purposeDetail || '—'}</div>
              <div className="sm:col-span-2"><strong className="text-slate-400 uppercase text-[10px] tracking-wider block mb-1">Check-in</strong> {selected.check_in_time ? new Date(selected.check_in_time).toLocaleString() : '—'}</div>
            </div>

            <div className="mt-6 flex justify-end gap-2.5 pt-4 border-t border-slate-800">
              <Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
