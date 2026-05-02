import Button from "../../components/ui/Button";

export default function AnnouncementsPage() {
  const announcementsData = [
    { id: 1, title: "Annual Owners Gala 2024", date: "Saturday, Nov 12", location: "Clubhouse", status: "Upcoming" },
    { id: 2, title: "Elevator Upgrade Schedule", date: "Monday, May 6", description: "Phase 1: Blocks A-D", status: "Urgent" },
    { id: 3, title: "Community Cleanup Drive", date: "Sunday, May 5", location: "Premises", status: "Upcoming" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Announcements</h1>
          <p className="text-gray-500 text-sm mt-1">Publish community announcements</p>
        </div>
        <Button variant="primary">+ New Announcement</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {announcementsData.map((announcement) => (
          <div key={announcement.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                announcement.status === "Urgent" 
                  ? "bg-orange-100 text-orange-700" 
                  : "bg-blue-100 text-blue-700"
              }`}>
                {announcement.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{announcement.date}</p>
            {announcement.location && <p className="text-sm text-gray-600 mb-3">📍 {announcement.location}</p>}
            {announcement.description && <p className="text-sm text-gray-600 mb-3">{announcement.description}</p>}
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">Edit</Button>
              <Button variant="ghost" size="sm">Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
