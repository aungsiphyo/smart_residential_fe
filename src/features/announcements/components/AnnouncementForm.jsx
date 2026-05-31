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
    <form onSubmit={submit} className="grid grid-cols-1 gap-4">
      <input required placeholder="Title" value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} className="rounded-2xl border px-4 py-3" />
      <textarea required placeholder="Message" value={form.message} onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))} className="rounded-2xl border px-4 py-3" />

      <div className="grid grid-cols-2 gap-4">
        <select value={form.type} onChange={(e) => setForm((s) => ({ ...s, type: e.target.value }))} className="rounded-2xl border px-4 py-3">
          <option>General</option>
          <option>Maintenance</option>
          <option>Event</option>
        </select>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Publish"}</Button>
        </div>
      </div>
    </form>
  );
}
