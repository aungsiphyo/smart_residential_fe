import Button from "../../components/ui/Button";

export default function NotificationsPage() {
  const notificationsData = [
    { id: 1, message: "Maintenance scheduled for Building A", date: "May 2, 2024", priority: "High", read: false },
    { id: 2, message: "New visitor check-in for Room 201", date: "May 1, 2024", priority: "Normal", read: true },
    { id: 3, message: "Monthly billing completed", date: "April 30, 2024", priority: "Normal", read: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Notifications</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all system notifications</p>
        </div>
        <Button variant="secondary">Mark All Read</Button>
      </div>

      <div className="space-y-3">
        {notificationsData.map((notif) => (
          <div 
            key={notif.id} 
            className={`p-4 rounded-lg border transition ${
              notif.read 
                ? "bg-white border-gray-200" 
                : "bg-blue-50 border-blue-200"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className={`text-sm ${notif.read ? "text-gray-600" : "font-semibold text-gray-900"}`}>
                  {notif.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">{notif.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  notif.priority === "High" 
                    ? "bg-red-100 text-red-700" 
                    : "bg-gray-100 text-gray-700"
                }`}>
                  {notif.priority}
                </span>
                <Button variant="ghost" size="sm">×</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
