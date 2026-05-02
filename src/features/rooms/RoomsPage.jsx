import Button from "../../components/ui/Button";

export default function RoomsPage() {
  const roomsData = [
    { id: 1, number: "101", type: "2BHK", status: "Occupied", resident: "John Doe" },
    { id: 2, number: "102", type: "3BHK", status: "Available", resident: "-" },
    { id: 3, number: "103", type: "2BHK", status: "Occupied", resident: "Jane Smith" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Rooms Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all residential units</p>
        </div>
        <Button variant="primary">+ Add Room</Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Room No.</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Resident</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roomsData.map((room) => (
              <tr key={room.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{room.number}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{room.type}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    room.status === "Occupied" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {room.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{room.resident}</td>
                <td className="px-6 py-4 text-sm">
                  <Button variant="ghost" size="sm">Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
