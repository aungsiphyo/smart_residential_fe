import Button from "../../../components/ui/Button";

const announcements = [
  {
    id: 1,
    title: "Annual Owners Gala 2024",
    date: "Saturday, Nov 12 • Clubhouse",
    badge: "Upcoming",
    badgeColor: "bg-blue-100 text-blue-700",
    image: "🎪",
  },
  {
    id: 2,
    title: "Elevator Upgrade Schedule",
    description: "Phase 1: Blocks A-D starting Monday",
    badge: "Urgent",
    badgeColor: "bg-orange-100 text-orange-700",
    image: "🏗️",
  },
];

export default function AnnouncementList() {
  const badgeStyles = {
    Upcoming: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Urgent: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };

  return (
    <div className="bg-[#0e1422] p-6 rounded-xl border border-slate-800/80 hover:border-slate-700/80 transition duration-150">

      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-white text-base tracking-tight">Community Announcements</h2>
        <Button variant="ghost" size="sm">View History →</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="rounded-xl border border-slate-800 bg-slate-900/30 p-5 hover:bg-slate-900/60 transition duration-150 flex flex-col justify-between h-40 relative group cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badgeStyles[announcement.badge] || 'bg-slate-900/60 text-slate-300 border-slate-800/50'}`}>
                {announcement.badge}
              </span>
              <span className="text-2xl select-none opacity-60 group-hover:opacity-100 transition-opacity">
                {announcement.image}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-slate-200 text-sm tracking-tight">{announcement.title}</h3>
              {announcement.date && (
                <p className="text-slate-400 text-xs mt-1.5 font-medium">{announcement.date}</p>
              )}
              {announcement.description && (
                <p className="text-slate-400 text-xs mt-1.5 font-medium">{announcement.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
