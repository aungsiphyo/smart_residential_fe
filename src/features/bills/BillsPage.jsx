import Button from "../../components/ui/Button";

export default function BillsPage() {
  const billsData = [
    { id: 1, room: "101", resident: "John Doe", amount: "$1,200", dueDate: "May 15, 2024", status: "Paid" },
    { id: 2, room: "205", resident: "Jane Smith", amount: "$1,500", dueDate: "May 20, 2024", status: "Pending" },
    { id: 3, room: "302", resident: "Mike Johnson", amount: "$1,100", dueDate: "May 10, 2024", status: "Overdue" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Bill Payments</h1>
          <p className="text-gray-500 text-sm mt-1">Manage residential billing</p>
        </div>
        <Button variant="primary">+ Generate Bill</Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Room</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Resident</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Due Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {billsData.map((bill) => (
              <tr key={bill.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{bill.room}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{bill.resident}</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{bill.amount}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{bill.dueDate}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    bill.status === "Paid" 
                      ? "bg-green-100 text-green-700" 
                      : bill.status === "Pending"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {bill.status}
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
