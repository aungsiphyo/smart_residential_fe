import Button from "../../components/ui/Button";

export default function NotificationsPage() {
  const notificationsData = [
    { id: 1, message: "Maintenance scheduled for Building A", date: "May 2, 2026", priority: "High", read: false },
    { id: 2, message: "New visitor check-in for Room 201", date: "May 1, 2026", priority: "Normal", read: true },
    { id: 3, message: "Monthly billing completed", date: "April 30, 2026", priority: "Normal", read: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Notifications</h1>
          <p className="text-slate-400 text-sm mt-1">Manage and view all system notifications</p>
        </div>
        <Button variant="secondary">Mark All Read</Button>
      </div>

      <div className="space-y-3">
        {notificationsData.map((notif) => (
          <div 
            key={notif.id} 
            className={`p-5 rounded-xl border transition duration-150 ${
              notif.read 
                ? "bg-[#0e1422] border-slate-800 hover:border-slate-700" 
                : "bg-blue-950/20 border-blue-900/40 hover:border-blue-900/60"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-1">
                <p className={`text-sm ${notif.read ? "text-slate-300 font-medium" : "font-bold text-white"}`}>
                  {notif.message}
                </p>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{notif.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium border ${
                  notif.priority === "High" 
                    ? "bg-red-500/10 text-red-400 border-red-500/20" 
                    : "bg-slate-900/60 text-slate-300 border-slate-800/50"
                }`}>
                  {notif.priority}
                </span>
                <Button variant="secondary" size="sm" className="w-7 h-7 !p-0 flex items-center justify-center text-slate-400 hover:text-slate-200">✕</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
