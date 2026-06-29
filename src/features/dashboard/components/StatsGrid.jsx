import { Users, Home, UserCheck, DollarSign, Wrench, Car } from "lucide-react";

export default function StatsGrid({ statsData }) {
  const stats = [
    { label: "Residents", value: statsData?.residents || 0, icon: Users, badge: "+4%" },
    { label: "Rooms Avail.", value: statsData?.roomsAvailable || 0, icon: Home },
    { label: "Visitors", value: statsData?.liveVisitors || 0, icon: UserCheck, badge: "LIVE" },
    { label: "Unpaid Bills", value: statsData?.unpaidBills || 0, icon: DollarSign },
    { label: "Helpers", value: statsData?.helpers || 0, icon: Wrench },
    { label: "Parking Cap.", value: `${statsData?.parkingCapacity || 0}%`, icon: Car },
  ];

  const badgeStyles = {
    "+4%": "bg-emerald-50 text-emerald-500 border-emerald-100",
    "LIVE": "bg-red-50 text-red-500 border-red-100 animate-pulse",
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((s) => {
        const IconComponent = s.icon;
        return (
          <div
            key={s.label}
            className="bg-white dark:bg-[#0e1422] rounded-xl p-5 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-50 dark:bg-slate-900/40 text-gray-400 dark:text-slate-500 border border-gray-100 dark:border-slate-800">
                <IconComponent size={16} strokeWidth={2.5} />
              </div>
              {s.badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badgeStyles[s.badge] || 'bg-gray-100 dark:bg-slate-800/60 text-gray-500 dark:text-slate-400 border-gray-200 dark:border-slate-700/80'}`}>
                  {s.badge}
                </span>
              )}
            </div>
            <div>
              <p className="text-gray-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">{s.label}</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white mt-1 tracking-tight">{s.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}