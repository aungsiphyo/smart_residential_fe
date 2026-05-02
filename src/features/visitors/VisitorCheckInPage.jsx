import Button from "../../components/ui/Button";

export default function VisitorCheckInPage() {
  const visitorsData = [
    { id: 1, name: "John Visitor", room: "101", date: "May 2, 2024", time: "10:30 AM", status: "Checked In" },
    { id: 2, name: "Emily Brown", room: "205", date: "May 2, 2024", time: "2:15 PM", status: "Checked Out" },
    { id: 3, name: "David Lee", room: "302", date: "May 2, 2024", time: "3:45 PM", status: "Checked In" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Visitor Check-in</h1>
          <p className="text-gray-500 text-sm mt-1">Track visitor entries and exits</p>
        </div>
        <Button variant="primary">+ Check-in Visitor</Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Visitor Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Room</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Time</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visitorsData.map((visitor) => (
              <tr key={visitor.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{visitor.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{visitor.room}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{visitor.date}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{visitor.time}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    visitor.status === "Checked In" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {visitor.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <Button variant="ghost" size="sm">View</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
