import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Button from "../../components/ui/Button";

const API_BASE_URL = "http://localhost:5001/api";

export default function ReportsPage() {
  const [bills, setBills] = useState([]);
  const [userReports, setUserReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBills = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/bills`);
      setBills(res.data.data || res.data.bills || []);
    } catch (err) {
      console.error("Fetch bills error:", err);
    }
  };

  const fetchUserReports = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/reports`);
      setUserReports(res.data.data || []);
    } catch (err) {
      console.error("Fetch user reports error:", err);
    }
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchBills(), fetchUserReports()]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const paidBills = bills.filter((bill) => bill.status === "Paid");

  const revenueReports = useMemo(() => {
    const now = new Date();

    const isSameDay = (date) => {
      const d = new Date(date);
      return (
        d.getDate() === now.getDate() &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    };

    const isSameMonth = (date) => {
      const d = new Date(date);
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    };

    const isSameYear = (date) => {
      const d = new Date(date);
      return d.getFullYear() === now.getFullYear();
    };

    const makeReport = (title, type, filterFn) => {
      const filteredBills = paidBills.filter((bill) =>
        filterFn(bill.created_at || bill.createdAt || bill.due_date),
      );

      const totalRevenue = filteredBills.reduce(
        (sum, bill) => sum + Number(bill.amount || 0),
        0,
      );

      return {
        id: type,
        reportKind: "revenue",
        title,
        type,
        date: now.toLocaleDateString(),
        status: "Completed",
        totalRevenue,
        totalPayments: filteredBills.length,
        bills: filteredBills,
      };
    };

    return [
      makeReport("Daily User Payment Revenue", "Daily", isSameDay),
      makeReport("Monthly User Payment Revenue", "Monthly", isSameMonth),
      makeReport("Yearly User Payment Revenue", "Yearly", isSameYear),
    ];
  }, [paidBills]);

  const downloadRevenuePDF = (report) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(report.title, 14, 20);

    doc.setFontSize(11);
    doc.text(`Report Type: ${report.type}`, 14, 30);
    doc.text(`Date: ${report.date}`, 14, 38);
    doc.text(`Total Payments: ${report.totalPayments}`, 14, 46);
    doc.text(
      `Total Revenue: ${report.totalRevenue.toLocaleString()} MMK`,
      14,
      54,
    );

    autoTable(doc, {
      startY: 65,
      head: [["Room", "Amount", "Status", "Due Date"]],
      body: report.bills.map((bill) => [
        bill.room_id?.room_number || bill.room_id?._id || "N/A",
        `${Number(bill.amount || 0).toLocaleString()} MMK`,
        bill.status || "N/A",
        bill.due_date ? new Date(bill.due_date).toLocaleDateString() : "N/A",
      ]),
    });

    doc.save(`${report.type}-Revenue-Report.pdf`);
  };

  const downloadUserReportPDF = (report) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("User Submitted Report", 14, 20);

    doc.setFontSize(11);
    doc.text(`Title: ${report.title || "N/A"}`, 14, 32);
    doc.text(`Type: ${report.type || "N/A"}`, 14, 40);
    doc.text(`Status: ${report.status || "Pending"}`, 14, 48);
    doc.text(`Location: ${report.location || "N/A"}`, 14, 56);
    doc.text(
      `Submitted Date: ${
        report.created_at
          ? new Date(report.created_at).toLocaleString()
          : report.createdAt
            ? new Date(report.createdAt).toLocaleString()
            : "N/A"
      }`,
      14,
      64,
    );

    autoTable(doc, {
      startY: 75,
      head: [["Message"]],
      body: [[report.message || "No message"]],
      styles: { cellWidth: "wrap" },
    });

    doc.save(`${report.title || "User-Report"}.pdf`);
  };

  const statusBadgeClass = (status) => {
    if (status === "Resolved" || status === "Completed" || status === "Paid") {
      return "bg-green-100 text-green-700";
    }

    if (status === "In Progress" || status === "Pending") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-red-100 text-red-700";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-blue-900">Reports</h1>
        <p className="text-gray-500 text-sm mt-1">
          View revenue reports and user submitted reports
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-blue-900">Revenue Reports</h2>
          <p className="text-sm text-gray-500">
            Daily, monthly and yearly user payment revenue
          </p>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Report Title
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Type
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Revenue
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Payments
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-6 text-center text-gray-500">
                  Loading reports...
                </td>
              </tr>
            ) : (
              revenueReports.map((report) => (
                <tr
                  key={report.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                    {report.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {report.type}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-blue-900">
                    {report.totalRevenue.toLocaleString()} MMK
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {report.totalPayments}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadgeClass(
                        report.status,
                      )}`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedReport(report)}
                    >
                      Details
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => downloadRevenuePDF(report)}
                    >
                      PDF
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-blue-900">
            User Submitted Reports
          </h2>
          <p className="text-sm text-gray-500">
            Reports submitted by users will appear here
          </p>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Title
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Type
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Location
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-6 text-center text-gray-500">
                  Loading user reports...
                </td>
              </tr>
            ) : userReports.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-6 text-center text-gray-500">
                  No user reports found
                </td>
              </tr>
            ) : (
              userReports.map((report) => (
                <tr
                  key={report._id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                    {report.title || "Untitled Report"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {report.type || "General"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {report.location || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadgeClass(
                        report.status || "Pending",
                      )}`}
                    >
                      {report.status || "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {report.created_at
                      ? new Date(report.created_at).toLocaleDateString()
                      : report.createdAt
                        ? new Date(report.createdAt).toLocaleDateString()
                        : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setSelectedReport({
                          ...report,
                          reportKind: "user",
                        })
                      }
                    >
                      Details
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => downloadUserReportPDF(report)}
                    >
                      PDF
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedReport && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-3xl p-6 shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-blue-900">
                  {selectedReport.title || "Report Details"}
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedReport.type || "General Report"}
                </p>
              </div>

              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-500 hover:text-red-600 text-xl"
              >
                ✕
              </button>
            </div>

            {selectedReport.reportKind === "revenue" ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Revenue</p>
                    <p className="text-xl font-bold text-blue-900">
                      {selectedReport.totalRevenue.toLocaleString()} MMK
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Payments</p>
                    <p className="text-xl font-bold text-green-700">
                      {selectedReport.totalPayments}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="text-xl font-bold text-gray-800">
                      {selectedReport.date}
                    </p>
                  </div>
                </div>

                <div className="max-h-[400px] overflow-y-auto border rounded-lg">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm">Room</th>
                        <th className="px-4 py-3 text-left text-sm">Amount</th>
                        <th className="px-4 py-3 text-left text-sm">Status</th>
                        <th className="px-4 py-3 text-left text-sm">
                          Due Date
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {selectedReport.bills.length === 0 ? (
                        <tr>
                          <td
                            colSpan="4"
                            className="px-4 py-6 text-center text-gray-500"
                          >
                            No paid payment data found
                          </td>
                        </tr>
                      ) : (
                        selectedReport.bills.map((bill) => (
                          <tr key={bill._id} className="border-t">
                            <td className="px-4 py-3 text-sm">
                              {bill.room_id?.room_number ||
                                bill.room_id?._id ||
                                "N/A"}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {Number(bill.amount || 0).toLocaleString()} MMK
                            </td>
                            <td className="px-4 py-3 text-sm">{bill.status}</td>
                            <td className="px-4 py-3 text-sm">
                              {bill.due_date
                                ? new Date(bill.due_date).toLocaleDateString()
                                : "N/A"}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="secondary"
                    onClick={() => downloadRevenuePDF(selectedReport)}
                  >
                    Download PDF
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-sm text-gray-700">
                <p>
                  <strong>Title:</strong> {selectedReport.title || "N/A"}
                </p>
                <p>
                  <strong>Type:</strong> {selectedReport.type || "N/A"}
                </p>
                <p>
                  <strong>Status:</strong> {selectedReport.status || "Pending"}
                </p>
                <p>
                  <strong>Location:</strong> {selectedReport.location || "N/A"}
                </p>
                <p>
                  <strong>Message:</strong>
                </p>
                <div className="bg-gray-50 border rounded-lg p-4">
                  {selectedReport.message || "No message"}
                </div>
                <p>
                  <strong>Submitted Date:</strong>{" "}
                  {selectedReport.created_at
                    ? new Date(selectedReport.created_at).toLocaleString()
                    : selectedReport.createdAt
                      ? new Date(selectedReport.createdAt).toLocaleString()
                      : "N/A"}
                </p>

                <div className="flex justify-end">
                  <Button
                    variant="secondary"
                    onClick={() => downloadUserReportPDF(selectedReport)}
                  >
                    Download PDF
                  </Button>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 mt-5">
              <Button variant="ghost" onClick={() => setSelectedReport(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
