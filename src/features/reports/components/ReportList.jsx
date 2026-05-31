import React from "react";
import Button from "../../../components/ui/Button";

export default function ReportList({ reports = [], onView, onUpdate }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Location</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Created</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r._id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{r.title}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{r.type}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{r.location}</td>
              <td className="px-6 py-4 text-sm">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  r.status === "Resolved" ? "bg-green-100 text-green-700" : r.status === "In Progress" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                }`}>
                  {r.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{r.created_at ? new Date(r.created_at).toLocaleString() : '-'}</td>
              <td className="px-6 py-4 text-sm flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => onView(r)}>View</Button>
                <Button variant="secondary" size="sm" onClick={() => onUpdate(r)}>Update</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
