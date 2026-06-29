import React from "react";
import Button from "../../../components/ui/Button";

export default function AnnouncementList({ items = [], onView }) {
  const typeBadgeStyle = {
    General: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Maintenance: "bg-red-500/10 text-red-400 border-red-500/20",
    Event: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };

  return (
    <div className="space-y-4">
      {items.map((a) => (
        <div 
          key={a._id} 
          className={`bg-[#0e1422] rounded-xl border border-slate-800 p-5 flex justify-between items-start hover:border-slate-700 transition duration-150 ${
            a.is_read ? "opacity-80" : ""
          }`}
        >
          <div className="space-y-1 flex-1 mr-4">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-white text-base">{a.title}</h3>
              <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium border ${typeBadgeStyle[a.type] || "bg-slate-900/60 text-slate-300 border-slate-800/50"}`}>
                {a.type}
              </span>
            </div>
            <p className="text-sm text-slate-300 font-medium leading-relaxed line-clamp-2">{a.message}</p>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider pt-1.5">
              {a.created_at ? new Date(a.created_at).toLocaleString() : ""}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <Button variant="secondary" size="sm" onClick={() => onView(a)}>View</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
