import React from "react";
import Button from "../../../components/ui/Button";

export default function VisitorList({ visitors = [], onView }) {
  return (
    <div className="bg-white dark:bg-[#0e1422] rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-mono uppercase tracking-wider">
          <tr>
            <th className="px-6 py-3 font-semibold">Visitor</th>
            <th className="px-6 py-3 font-semibold">Badge</th>
            <th className="px-6 py-3 font-semibold">Host</th>
            <th className="px-6 py-3 font-semibold">Room / Purpose</th>
            <th className="px-6 py-3 font-semibold">Check-in</th>
            <th className="px-6 py-3 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
          {visitors.map((v) => (
            <tr key={v._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors text-sm">
              <td className="px-6 py-4 text-slate-900 dark:text-white font-semibold">{v.fullname || `${v.firstName} ${v.lastName}`.trim()}</td>
              <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium font-mono">{v.badgeNumber || '—'}</td>
              <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium">{v.hostName || '—'}</td>
              <td className="px-6 py-4 text-slate-800 dark:text-slate-200 font-semibold font-mono">{v.target_room_id?.room_name || v.reason_for_visit || '—'}</td>
              <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-medium">{v.check_in_time ? new Date(v.check_in_time).toLocaleString() : '-'}</td>
              <td className="px-6 py-4 text-right">
                <Button variant="secondary" size="sm" onClick={() => onView(v)}>View</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
