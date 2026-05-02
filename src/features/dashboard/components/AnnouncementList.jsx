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
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">

      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-gray-900 text-lg">Community Announcements</h2>
        <Button variant="ghost" size="md">View History →</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="relative rounded-lg overflow-hidden h-48 cursor-pointer group"
          >
            {/* Background with gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-300 to-gray-400" />

            {/* Content overlay */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />

            {/* Badge */}
            <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${announcement.badgeColor}`}>
              {announcement.badge}
            </div>

            {/* Text content */}
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white font-bold text-lg">{announcement.title}</p>
              {announcement.date && (
                <p className="text-white/80 text-xs mt-2">{announcement.date}</p>
              )}
              {announcement.description && (
                <p className="text-white/80 text-xs mt-1">{announcement.description}</p>
              )}
            </div>

            {/* Icon */}
            <div className="absolute top-4 right-4 text-3xl opacity-30">
              {announcement.image}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
