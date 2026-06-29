const updates = [
  {
    id: 1,
    title: "Parking Violation: Block B",
    description: "Vehicle XY-402 parked in emergency zone",
    time: "2 mins ago",
    icon: "🚗",
  },
];

export default function LiveUpdates() {
  return (
    <div className="bg-[#0e1422] p-6 rounded-xl border border-slate-800/80 hover:border-slate-700/80 transition duration-150">

      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-white text-base tracking-tight">Live Updates</h2>
        <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
      </div>

      <div className="space-y-3">
        {updates.map((update) => (
          <div
            key={update.id}
            className="p-4 border border-slate-800 bg-slate-900/30 rounded-lg hover:bg-slate-900/60 transition duration-150"
          >
            <div className="flex items-start gap-3.5">
              <div className="text-xl select-none">{update.icon}</div>
              <div className="flex-1">
                <p className="font-bold text-slate-200 text-sm tracking-tight">{update.title}</p>
                <p className="text-xs text-slate-400 mt-1.5 font-medium leading-relaxed">{update.description}</p>
                <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-wider">{update.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
