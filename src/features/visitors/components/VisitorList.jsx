import React from "react";
import Button from "../../../components/ui/Button";

export default function VisitorList({ visitors = [], onView }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Visitor</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Badge</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Host</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Room</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Check-in</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody>
          {visitors.map((v) => (
            <tr key={v._id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{v.fullname || `${v.firstName} ${v.lastName}`.trim()}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{v.badgeNumber || '—'}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{v.hostName || '—'}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{v.target_room_id?.room_name || v.reason_for_visit || '—'}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{v.check_in_time ? new Date(v.check_in_time).toLocaleString() : '-'}</td>
              <td className="px-6 py-4 text-sm">
                <Button variant="ghost" size="sm" onClick={() => onView(v)}>View</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
