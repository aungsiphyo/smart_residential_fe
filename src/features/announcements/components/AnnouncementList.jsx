import React from "react";
import Button from "../../../components/ui/Button";

export default function AnnouncementList({ items = [], onView }) {
  return (
    <div className="space-y-3">
      {items.map((a) => (
        <div key={a._id} className={`bg-white rounded-lg border p-4 flex justify-between items-start ${a.is_read ? "opacity-80" : ""}`}>
          <div>
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-gray-900">{a.title}</h3>
              <span className="text-xs text-gray-500">{a.type}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">{a.message}</p>
            <p className="text-xs text-gray-400 mt-2">{a.created_at ? new Date(a.created_at).toLocaleString() : ""}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => onView(a)}>View</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
