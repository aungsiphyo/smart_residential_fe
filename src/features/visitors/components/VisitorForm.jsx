import React, { useState } from "react";
import Button from "../../../components/ui/Button";

export default function VisitorForm({ onCancel, onSubmit, initial = {} }) {
  const [form, setForm] = useState({
    firstName: initial.firstName || "",
    lastName: initial.lastName || "",
    email: initial.email || "",
    phone: initial.phone || "",
    company: initial.company || "",
    hostName: initial.hostName || "",
    purpose: initial.purpose || "Other",
    purposeDetail: initial.purposeDetail || "",
    agreedToTerms: initial.agreedToTerms || false,
  });

  const submit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={submit} className="grid grid-cols-1 gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          required
          placeholder="First name"
          value={form.firstName}
          onChange={(e) => setForm((s) => ({ ...s, firstName: e.target.value }))}
          className="rounded-lg border border-slate-800 px-3.5 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 text-slate-200 transition bg-slate-900/40 focus:bg-slate-900/60 placeholder-slate-500"
        />
        <input
          required
          placeholder="Last name"
          value={form.lastName}
          onChange={(e) => setForm((s) => ({ ...s, lastName: e.target.value }))}
          className="rounded-lg border border-slate-800 px-3.5 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 text-slate-200 transition bg-slate-900/40 focus:bg-slate-900/60 placeholder-slate-500"
        />
      </div>

      <input
        required
        placeholder="Phone"
        value={form.phone}
        onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
        className="w-full rounded-lg border border-slate-800 px-3.5 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 text-slate-200 transition bg-slate-900/40 focus:bg-slate-900/60 placeholder-slate-500"
      />
      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
        className="w-full rounded-lg border border-slate-800 px-3.5 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 text-slate-200 transition bg-slate-900/40 focus:bg-slate-900/60 placeholder-slate-500"
      />
      <input
        placeholder="Company"
        value={form.company}
        onChange={(e) => setForm((s) => ({ ...s, company: e.target.value }))}
        className="w-full rounded-lg border border-slate-800 px-3.5 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 text-slate-200 transition bg-slate-900/40 focus:bg-slate-900/60 placeholder-slate-500"
      />
      <input
        required
        placeholder="Host name"
        value={form.hostName}
        onChange={(e) => setForm((s) => ({ ...s, hostName: e.target.value }))}
        className="w-full rounded-lg border border-slate-800 px-3.5 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 text-slate-200 transition bg-slate-900/40 focus:bg-slate-900/60 placeholder-slate-500"
      />

      <textarea
        placeholder="Purpose detail / room"
        value={form.purposeDetail}
        onChange={(e) => setForm((s) => ({ ...s, purposeDetail: e.target.value }))}
        className="w-full rounded-lg border border-slate-800 px-3.5 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 text-slate-200 transition bg-slate-900/40 focus:bg-slate-900/60 placeholder-slate-500 min-h-[80px]"
      />

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={form.agreedToTerms}
          onChange={(e) => setForm((s) => ({ ...s, agreedToTerms: e.target.checked }))}
          className="w-4 h-4 rounded text-blue-700 focus:ring-blue-500/20 border-slate-800 accent-blue-700 cursor-pointer"
        />
        <label className="text-sm font-semibold text-slate-300 select-none cursor-pointer">I agree to the terms</label>
      </div>

      <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-800 mt-2">
        <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Register</Button>
      </div>
    </form>
  );
}
