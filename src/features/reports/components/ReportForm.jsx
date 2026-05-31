import React, { useState } from "react";
import Button from "../../../components/ui/Button";

export default function ReportForm({ initial = {}, onCancel, onSubmit }) {
  const [form, setForm] = useState({
    title: initial.title || "",
    message: initial.message || "",
    type: initial.type || "Maintenance",
    location: initial.location || "",
    status: initial.status || "Open",
  });

  const submit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={submit} className="grid grid-cols-1 gap-4">
      <input required placeholder="Title" value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} className="rounded-2xl border px-4 py-3" />
      <textarea required placeholder="Message" value={form.message} onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))} className="rounded-2xl border px-4 py-3" />

      <div className="grid grid-cols-2 gap-4">
        <select value={form.type} onChange={(e) => setForm((s) => ({ ...s, type: e.target.value }))} className="rounded-2xl border px-4 py-3">
          <option>Maintenance</option>
          <option>Security</option>
          <option>Other</option>
        </select>
        <input placeholder="Location" value={form.location} onChange={(e) => setForm((s) => ({ ...s, location: e.target.value }))} className="rounded-2xl border px-4 py-3" />
      </div>

      <div className="grid grid-cols-2 gap-4 items-center">
        <select value={form.status} onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))} className="rounded-2xl border px-4 py-3">
          <option>Open</option>
          <option>In Progress</option>
          <option>Resolved</option>
        </select>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Save</Button>
        </div>
      </div>
    </form>
  );
}
