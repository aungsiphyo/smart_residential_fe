import Button from "../../components/ui/Button";

export default function VisitorCheckInPage() {
  const visitorsData = [
    { id: 1, name: "Kyaw Kyaw", room: "101", date: "May 2, 2026", time: "10:30 AM", status: "Checked In" },
    { id: 2, name: "Hla Hla", room: "205", date: "May 2, 2026", time: "2:15 PM", status: "Checked Out" },
    { id: 3, name: "Aung Aung", room: "302", date: "May 2, 2026", time: "3:45 PM", status: "Checked In" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Visitor Check-in</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track visitor entries and exits</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0e1422] rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-mono uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3 font-semibold">Visitor Name</th>
              <th className="px-6 py-3 font-semibold">Room</th>
              <th className="px-6 py-3 font-semibold">Date</th>
              <th className="px-6 py-3 font-semibold">Time</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
            {visitorsData.map((visitor) => (
              <tr key={visitor.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors text-sm">
                <td className="px-6 py-4 text-slate-900 dark:text-white font-semibold">{visitor.name}</td>
                <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium font-mono">{visitor.room}</td>
                <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium">{visitor.date}</td>
                <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium">{visitor.time}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium border inline-flex items-center justify-center ${
                    visitor.status === "Checked In" 
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                      : "bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800"
                  }`}>
                    {visitor.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button variant="secondary" size="sm">View</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
