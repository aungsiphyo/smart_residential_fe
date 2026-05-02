import Button from "../../components/ui/Button";

export default function ParkingPage() {
  const parkingData = [
    { id: 1, spot: "A-001", resident: "John Doe", vehicle: "BMW X5", status: "Occupied" },
    { id: 2, spot: "A-002", resident: "-", vehicle: "-", status: "Available" },
    { id: 3, spot: "B-005", resident: "Jane Smith", vehicle: "Toyota Fortuner", status: "Occupied" },
    { id: 4, spot: "B-006", resident: "-", vehicle: "-", status: "Available" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Car Parking</h1>
          <p className="text-gray-500 text-sm mt-1">Manage parking slots and allocations</p>
        </div>
        <Button variant="primary">+ Allocate Spot</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-gray-600 text-sm mb-2">Total Spots</p>
          <p className="text-3xl font-bold text-blue-900">48</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-gray-600 text-sm mb-2">Occupied</p>
          <p className="text-3xl font-bold text-green-600">42</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-gray-600 text-sm mb-2">Available</p>
          <p className="text-3xl font-bold text-blue-600">6</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-gray-600 text-sm mb-2">Occupancy Rate</p>
          <p className="text-3xl font-bold text-blue-900">88%</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Spot ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Resident</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Vehicle</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {parkingData.map((spot) => (
              <tr key={spot.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{spot.spot}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{spot.resident}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{spot.vehicle}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    spot.status === "Occupied" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {spot.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <Button variant="ghost" size="sm">Manage</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
