import React, { useState, useEffect } from "react";
import API from "../../services/axios";
import { Building2, FileText, CheckCircle, Clock, AlertCircle, Copy, Send, Banknote, ShieldCheck } from "lucide-react";

export default function BillsPage() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await API.get(`/bills`);
        setBills(res.data.data || []);
      } catch (err) {
        console.error("Fetch bills error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
  }, []);

  const totalRevenue = bills
    .filter(b => b.status === "Paid")
    .reduce((sum, b) => sum + Number(b.amount || 0), 0);
  
  const paidCount = bills.filter(b => b.status === "Paid").length;
  const totalCount = bills.length || 1; // avoid div by 0
  const paidPercent = Math.round((paidCount / totalCount) * 100);
  const pendingVerificationCount = bills.filter(b => b.status === "Pending Verification").length;

  const getGatewayStats = () => {
    const kbz = bills.filter(b => b.payment_method === "KBZPay" && (b.status === "Paid" || b.status === "Pending Verification"));
    const wave = bills.filter(b => b.payment_method === "WavePay" && (b.status === "Paid" || b.status === "Pending Verification"));
    
    const kbzTotal = kbz.reduce((s, b) => s + Number(b.amount || 0), 0);
    const waveTotal = wave.reduce((s, b) => s + Number(b.amount || 0), 0);
    return { kbzTotal, waveTotal };
  };

  const { kbzTotal, waveTotal } = getGatewayStats();

  return (
    <div className="bg-[#f8f9fc] dark:bg-transparent font-sans rounded-tl-2xl min-h-[calc(100vh-64px)] p-8">
      {/* Main Content */}
      <div className="overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gray-500 dark:text-slate-400 text-xs font-bold tracking-widest uppercase">Landlord Desk</span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              <span className="text-green-500 text-xs font-bold tracking-widest uppercase">Live Preview Mode</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Bill Payments Ledger</h1>
            <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">Financial overview of collected and pending monthly payments</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-0 bg-[#1e1b4b] rounded-xl p-1 shadow-lg">
              <div className="px-5 py-2 text-left">
                <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-wider mb-0.5">Active Period</p>
                <p className="text-white text-sm font-semibold">June 2026</p>
              </div>
              <button className="bg-blue-700 hover:bg-blue-600 text-white text-sm font-semibold px-5 py-3 rounded-lg transition-colors flex items-center gap-2 shadow-inner">
                Start Next Month <span className="text-lg leading-none">&rarr;</span>
              </button>
            </div>
            <div className="bg-white dark:bg-[#0e1422] border border-gray-200 dark:border-slate-700/80 rounded-xl p-3 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800/60 flex items-center justify-center font-bold text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700/80">
                SP
              </div>
              <div className="pr-2 text-left">
                <p className="text-gray-900 dark:text-white text-sm font-bold leading-tight">Shwe Pwint</p>
                <p className="text-gray-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">Property Admin</p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Revenue Card */}
          <div className="bg-white dark:bg-[#0e1422] rounded-2xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <h3 className="text-gray-500 dark:text-slate-400 text-xs font-bold tracking-widest uppercase">Total Revenue Collected</h3>
              <span className="bg-green-100 text-green-600 text-xs font-bold px-2 py-0.5 rounded-md">+8.5%</span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">{totalRevenue.toLocaleString()}</h2>
              <span className="text-gray-500 dark:text-slate-400 font-bold text-lg">MMK</span>
            </div>
            <div className="mt-6 flex items-center gap-2 text-gray-400 dark:text-slate-500 text-xs font-semibold">
              <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-slate-700 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-gray-400"></div>
              </div>
              Live Simulated Frontend
            </div>
          </div>

          {/* Paid Residents Card */}
          <div className="bg-white dark:bg-[#0e1422] rounded-2xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <h3 className="text-gray-500 dark:text-slate-400 text-xs font-bold tracking-widest uppercase">Paid Residents</h3>
              <span className="text-blue-600 text-xs font-bold">{paidPercent}% Goal</span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">{paidCount}</h2>
              <span className="text-gray-400 dark:text-slate-500 font-bold text-xl">/ {totalCount}</span>
            </div>
            <div className="mt-6">
              <div className="w-full bg-gray-100 dark:bg-slate-800/60 rounded-full h-1.5 mb-2">
                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${paidPercent}%` }}></div>
              </div>
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-green-500">{totalCount - paidCount} PAYMENTS REMAINING</span>
                <span className="text-blue-600 cursor-pointer hover:underline">View Paid &gt;</span>
              </div>
            </div>
          </div>

          {/* Pending Verification Card */}
          <div className="bg-orange-50/50 rounded-2xl border border-orange-100 p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -top-4 -right-4 p-4 opacity-10 transform rotate-12">
              <ShieldCheck size={120} className="text-orange-500" />
            </div>
            <div>
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                <ShieldCheck size={18} />
              </div>
              <h2 className="text-4xl font-extrabold text-orange-600 tracking-tight">{pendingVerificationCount}</h2>
              <h3 className="text-orange-800 text-xs font-bold tracking-widest uppercase mt-2">Pending Verification</h3>
            </div>
            <div className="mt-6 text-orange-600 text-sm font-bold cursor-pointer hover:underline relative z-10">
              Review Actions Required &gt;
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-[#0e1422] rounded-2xl border border-gray-100 dark:border-slate-800 p-4 shadow-sm flex items-center gap-4 mb-8">
          <span className="text-gray-500 dark:text-slate-400 text-xs font-bold tracking-widest uppercase px-4">Quick Actions:</span>
          <button className="bg-[#2d1b7a] hover:bg-indigo-900 text-white text-sm font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors">
            <Copy size={16} /> Export Clipboard
          </button>
          <button className="bg-white dark:bg-[#0e1422] hover:bg-gray-50 dark:bg-slate-900/40 border border-gray-200 dark:border-slate-700/80 text-gray-700 dark:text-slate-300 text-sm font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors">
            <Send size={16} className="text-orange-500" /> Send Reminders
          </button>
          <div className="flex-1"></div>
          <button className="bg-white dark:bg-[#0e1422] hover:bg-gray-50 dark:bg-slate-900/40 border border-gray-200 dark:border-slate-700/80 text-gray-700 dark:text-slate-300 text-sm font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors">
            <Banknote size={16} className="text-green-500" /> Record Cash Pay
          </button>
        </div>

        {/* Bottom Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8">
          {/* Payment Gateways */}
          <div className="bg-white dark:bg-[#0e1422] rounded-2xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm self-start">
            <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-6">Payment Gateways</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  <div>
                    <p className="text-gray-900 dark:text-white font-bold">KBZPay</p>
                    <p className="text-gray-400 dark:text-slate-500 text-[10px] font-bold tracking-widest uppercase">Mobile Bank Wallet</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-900 dark:text-white font-bold">{kbzTotal.toLocaleString()} MMK</p>
                  <p className="text-green-500 text-[10px] font-bold tracking-widest uppercase">62% Verified</p>
                </div>
              </div>
              <hr className="border-gray-100 dark:border-slate-800" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                  <div>
                    <p className="text-gray-900 dark:text-white font-bold">WavePay</p>
                    <p className="text-gray-400 dark:text-slate-500 text-[10px] font-bold tracking-widest uppercase">Mobile Money Transfer</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-900 dark:text-white font-bold">{waveTotal.toLocaleString()} MMK</p>
                  <p className="text-green-500 text-[10px] font-bold tracking-widest uppercase">88% Verified</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="lg:col-span-2 bg-white dark:bg-[#0e1422] rounded-2xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-4">Recent Transactions List</h3>
            <div className="space-y-3">
              {bills.slice(0, 5).map((bill) => (
                <div key={bill._id} className="bg-white dark:bg-[#0e1422] rounded-xl border border-gray-100 dark:border-slate-800 p-4 hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 flex items-center justify-center font-bold border border-indigo-100 dark:border-indigo-900/50">
                      {bill.room_id?.resident_id?.fullname?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="text-gray-900 dark:text-white font-bold">{bill.room_id?.resident_id?.fullname || "Unknown Resident"}</p>
                      <p className="text-gray-400 dark:text-slate-500 text-xs font-medium">Room {bill.room_id?.room_name || bill.room_id} • {new Date(bill.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="text-left md:text-center w-24">
                    <span className="text-gray-900 dark:text-white font-semibold text-sm">{bill.payment_method || "Pending"}</span>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-gray-900 dark:text-white font-bold">{Number(bill.amount).toLocaleString()} MMK</p>
                    {bill.status === "Paid" ? (
                      <p className="text-green-500 text-[10px] font-bold tracking-widest uppercase flex items-center md:justify-end gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> VERIFIED
                      </p>
                    ) : bill.status === "Pending Verification" ? (
                      <p className="text-orange-500 text-[10px] font-bold tracking-widest uppercase flex items-center md:justify-end gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> REVIEW
                      </p>
                    ) : (
                      <p className="text-gray-400 dark:text-slate-500 text-[10px] font-bold tracking-widest uppercase flex items-center md:justify-end gap-1">
                         <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span> {bill.status}
                      </p>
                    )}
                  </div>
                  
                  <button className="bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-700 text-xs font-bold px-4 py-2 rounded-lg transition-colors border border-indigo-100 dark:border-indigo-900/50 self-start md:self-auto">
                    Details
                  </button>
                </div>
              ))}
              {bills.length === 0 && !loading && (
                <div className="text-center py-10 text-gray-400 dark:text-slate-500 font-medium">No transactions found</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
