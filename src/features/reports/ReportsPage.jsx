import Button from "../../components/ui/Button";

export default function ReportsPage() {
  const reportsData = [
    { id: 1, title: "Monthly Revenue Report", date: "May 1, 2024", type: "Financial", status: "Completed" },
    { id: 2, title: "Maintenance Issues Summary", date: "May 2, 2024", type: "Maintenance", status: "In Progress" },
    { id: 3, title: "Occupancy Rate Report", date: "April 30, 2024", type: "Operations", status: "Completed" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Reports</h1>
          <p className="text-gray-500 text-sm mt-1">View and generate system reports</p>
        </div>
        <Button variant="primary">+ Generate Report</Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Report Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reportsData.map((report) => (
              <tr key={report.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{report.title}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{report.type}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{report.date}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    report.status === "Completed" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm flex gap-2">
                  <Button variant="ghost" size="sm">View</Button>
                  <Button variant="secondary" size="sm">Download</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
