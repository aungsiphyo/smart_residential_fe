import React, { useState } from "react";
import Button from "../../../components/ui/Button";

export default function AnnouncementForm({ initial = {}, onCancel, onSubmit }) {
  const [form, setForm] = useState({
    title: initial.title || "",
    message: initial.message || "",
    type: initial.type || "General",
  });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Title</label>
        <input required placeholder="Enter announcement title" value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} className="w-full rounded-lg border border-slate-800 px-3.5 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition-all text-slate-200 bg-slate-900/40 focus:bg-slate-900/60 placeholder-slate-500" />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Message</label>
        <textarea required rows={4} placeholder="Write the announcement details..." value={form.message} onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))} className="w-full rounded-lg border border-slate-800 px-3.5 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition-all text-slate-200 bg-slate-900/40 focus:bg-slate-900/60 placeholder-slate-500 min-h-[100px]" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Announcement Type</label>
          <select value={form.type} onChange={(e) => setForm((s) => ({ ...s, type: e.target.value }))} className="w-full rounded-lg border border-slate-800 bg-[#0e1422] px-3.5 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition-all text-slate-200 cursor-pointer">
            <option>General</option>
            <option>Maintenance</option>
            <option>Event</option>
          </select>
        </div>
        <div className="flex justify-end gap-2.5">
          <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Publish"}</Button>
        </div>
      </div>
    </form>
  );
}
