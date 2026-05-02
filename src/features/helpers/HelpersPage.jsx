import Button from "../../components/ui/Button";

export default function HelpersPage() {
  const helpersData = [
    { id: 1, name: "Ravi Kumar", role: "Housekeeper", phone: "+91-98765-43210", status: "Active" },
    { id: 2, name: "Priya Singh", role: "Maintenance", phone: "+91-98765-43211", status: "Active" },
    { id: 3, name: "Amit Verma", role: "Security", phone: "+91-98765-43212", status: "Inactive" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Helpers Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage support staff</p>
        </div>
        <Button variant="primary">+ Add Helper</Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {helpersData.map((helper) => (
              <tr key={helper.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{helper.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{helper.role}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{helper.phone}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    helper.status === "Active" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {helper.status}
                  </span>
                </td>
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
