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
      return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    }

    if (status === "In Progress" || status === "Pending") {
      return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
    }

    return "bg-red-500/10 text-red-400 border border-red-500/20";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Reports</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          View revenue reports and user submitted reports
        </p>
      </div>

      <div className="bg-white dark:bg-[#0e1422] rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Revenue Reports</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Daily, monthly and yearly user payment revenue
          </p>
        </div>

        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-mono uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3 font-semibold">REPORT TITLE</th>
              <th className="px-6 py-3 font-semibold">TYPE</th>
              <th className="px-6 py-3 font-semibold">REVENUE</th>
              <th className="px-6 py-3 font-semibold">PAYMENTS</th>
              <th className="px-6 py-3 font-semibold">STATUS</th>
              <th className="px-6 py-3 font-semibold text-right">ACTIONS</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 font-medium">
                  Loading reports...
                </td>
              </tr>
            ) : (
              revenueReports.map((report) => (
                <tr
                  key={report.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors text-sm"
                >
                  <td className="px-6 py-4 text-slate-900 dark:text-white font-semibold">
                    {report.title}
                  </td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium">
                    {report.type}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white font-mono">
                    {report.totalRevenue.toLocaleString()} MMK
                  </td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium font-mono">
                    {report.totalPayments}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-[10px] font-medium border items-center justify-center ${statusBadgeClass(
                        report.status,
                      )}`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedReport(report)}
                    >
                      Details
                    </Button>
                    <Button
                      variant="primary"
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

      <div className="bg-white dark:bg-[#0e1422] rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight border-none">
            User Submitted Reports
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Reports submitted by users will appear here
          </p>
        </div>

        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-mono uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3 font-semibold">TITLE</th>
              <th className="px-6 py-3 font-semibold">TYPE</th>
              <th className="px-6 py-3 font-semibold">LOCATION</th>
              <th className="px-6 py-3 font-semibold">STATUS</th>
              <th className="px-6 py-3 font-semibold">DATE</th>
              <th className="px-6 py-3 font-semibold text-right">ACTIONS</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 font-medium">
                  Loading user reports...
                </td>
              </tr>
            ) : userReports.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 font-medium">
                  No user reports found
                </td>
              </tr>
            ) : (
              userReports.map((report) => (
                <tr
                  key={report._id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors text-sm"
                >
                  <td className="px-6 py-4 text-slate-900 dark:text-white font-semibold">
                    {report.title || "Untitled Report"}
                  </td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium">
                    {report.type || "General"}
                  </td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium font-mono">
                    {report.location || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-[10px] font-medium border items-center justify-center ${statusBadgeClass(
                        report.status || "Pending",
                      )}`}
                    >
                      {report.status || "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium font-mono">
                    {report.created_at
                      ? new Date(report.created_at).toLocaleDateString()
                      : report.createdAt
                        ? new Date(report.createdAt).toLocaleDateString()
                        : "—"}
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <Button
                      variant="secondary"
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
                      variant="primary"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-[#0e1422] rounded-xl w-full max-w-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  {selectedReport.title || "Report Details"}
                </h2>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1.5 font-mono">
                  {selectedReport.type || "General Report"}
                </p>
              </div>

              <button
                onClick={() => setSelectedReport(null)}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {selectedReport.reportKind === "revenue" ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Revenue</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-1 font-mono">
                      {selectedReport.totalRevenue.toLocaleString()} MMK
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Payments</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-1 font-mono">
                      {selectedReport.totalPayments}
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-1 font-mono">
                      {selectedReport.date}
                    </p>
                  </div>
                </div>

                <div className="max-h-[300px] overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-lg">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 text-[10px] font-mono uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="px-4 py-2.5">Room</th>
                        <th className="px-4 py-2.5">Amount</th>
                        <th className="px-4 py-2.5">Status</th>
                        <th className="px-4 py-2.5">Due Date</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 text-sm">
                      {selectedReport.bills.length === 0 ? (
                        <tr>
                          <td
                            colSpan="4"
                            className="px-4 py-6 text-center text-slate-500 dark:text-slate-400 font-medium"
                          >
                            No paid payment data found
                          </td>
                        </tr>
                      ) : (
                        selectedReport.bills.map((bill) => (
                          <tr key={bill._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                            <td className="px-4 py-3 text-slate-900 dark:text-white font-semibold font-mono">
                              {bill.room_id?.room_number ||
                                bill.room_id?._id ||
                                "N/A"}
                            </td>
                            <td className="px-4 py-3 text-slate-800 dark:text-slate-200 font-semibold font-mono">
                              {Number(bill.amount || 0).toLocaleString()} MMK
                            </td>
                            <td className="px-4 py-3">
                              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                                {bill.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-slate-500 dark:text-slate-400 font-mono">
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

                <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
                  <Button
                    onClick={() => downloadRevenuePDF(selectedReport)}
                  >
                    Download PDF
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/30 p-5 rounded-lg border border-slate-200 dark:border-slate-800 font-medium">
                  <div><strong className="text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider block mb-1">Title</strong> {selectedReport.title || "—"}</div>
                  <div><strong className="text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider block mb-1">Type</strong> {selectedReport.type || "—"}</div>
                  <div><strong className="text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider block mb-1">Status</strong> {selectedReport.status || "Pending"}</div>
                  <div><strong className="text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider block mb-1">Location</strong> {selectedReport.location || "—"}</div>
                  <div className="sm:col-span-2">
                    <strong className="text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider block mb-1.5">Message</strong>
                    <div className="bg-white dark:bg-[#0e1422] border border-slate-200 dark:border-slate-800 rounded-lg p-4 text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                      {selectedReport.message || "No message"}
                    </div>
                  </div>
                  <div className="sm:col-span-2 font-mono">
                    <strong className="text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider block mb-1 font-sans">Submitted Date</strong>{" "}
                    {selectedReport.created_at
                      ? new Date(selectedReport.created_at).toLocaleString()
                      : selectedReport.createdAt
                        ? new Date(selectedReport.createdAt).toLocaleString()
                        : "—"}
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
                  <Button
                    onClick={() => downloadUserReportPDF(selectedReport)}
                  >
                    Download PDF
                  </Button>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2.5 mt-5">
              <Button variant="secondary" onClick={() => setSelectedReport(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
