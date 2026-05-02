import Button from "../../components/ui/Button";

export default function SosPage() {
  const sosAlertsData = [
    { id: 1, room: "305", caller: "Mrs. Sharma", alert: "Medical Emergency", time: "10:30 AM", status: "Resolved" },
    { id: 2, room: "102", caller: "Mr. Patel", alert: "Fire Alert", time: "2:15 PM", status: "In Progress" },
    { id: 3, room: "201", caller: "John Doe", alert: "Break-in Attempt", time: "8:45 PM", status: "Resolved" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">SOS Alerts</h1>
          <p className="text-gray-500 text-sm mt-1">Monitor emergency alerts</p>
        </div>
        <div className="flex gap-3">
          <Button variant="danger">+ Trigger Manual Alert</Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Room</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Caller</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Alert Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Time</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sosAlertsData.map((alert) => (
              <tr key={alert.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{alert.room}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{alert.caller}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                    {alert.alert}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{alert.time}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    alert.status === "Resolved" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {alert.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <Button variant="ghost" size="sm">View Details</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
