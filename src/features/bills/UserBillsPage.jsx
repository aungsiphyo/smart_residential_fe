import React, { useState, useEffect } from "react";
import API from "../../services/axios";
import useAuthStore from "../auth/authStore";
import { CreditCard, Wallet, Banknote, ShieldCheck, Clock, FileText, CheckCircle2, ChevronRight } from "lucide-react";

export default function UserBillsPage() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("KBZPay");
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const user = useAuthStore((state) => state.user);

  const fetchMyBills = async () => {
    try {
      const res = await API.get(`/bills/my-bills`);
      setBills(res.data.data || []);
    } catch (err) {
      console.error("Fetch bills error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBills();
  }, []);

  const handlePay = async () => {
    if (!selectedBill) return;
    setIsProcessing(true);
    try {
      const res = await API.put(`/bills/${selectedBill._id}/pay`, {
        payment_method: paymentMethod
      });
      
      setSuccessMsg("Payment submitted successfully and is pending verification.");
      
      // Update local state
      setBills(bills.map(b => b._id === selectedBill._id ? res.data.bill : b));
      
      setTimeout(() => {
        setSuccessMsg("");
        setSelectedBill(null);
      }, 3000);
    } catch (err) {
      console.error("Payment error:", err);
      alert("Failed to process payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  const pendingBills = bills.filter(b => b.status === "Pending" || b.status === "Overdue");
  const paidBills = bills.filter(b => b.status === "Paid" || b.status === "Pending Verification");

  const totalDue = pendingBills.reduce((sum, b) => sum + Number(b.amount || 0), 0);

  return (
    <div className="p-8 bg-[#f8f9fc] dark:bg-transparent min-h-screen font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">My Bills & Payments</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-2">Manage your residential utility and service payments</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Action Needed Section */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <AlertCircle className="text-orange-500" size={20} /> Action Needed
              </h2>
              
              {pendingBills.length === 0 ? (
                <div className="bg-white dark:bg-[#0e1422] rounded-2xl border border-gray-100 dark:border-slate-800 p-8 text-center shadow-sm">
                  <CheckCircle2 size={48} className="mx-auto text-green-400 mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">All caught up!</h3>
                  <p className="text-gray-500 dark:text-slate-400 mt-1">You have no pending bills at the moment.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingBills.map(bill => (
                    <div key={bill._id} className="bg-white dark:bg-[#0e1422] rounded-2xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                          <FileText size={24} />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white text-lg">{bill.title}</h3>
                          <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">{bill.description || `${bill.type} Bill`}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-gray-400 dark:text-slate-500">
                            <Clock size={14} /> Due by {new Date(bill.due_date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:items-end gap-3 border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-100 dark:border-slate-800">
                        <div className="text-2xl font-extrabold text-gray-900 dark:text-white">
                          {Number(bill.amount).toLocaleString()} <span className="text-base text-gray-500 dark:text-slate-400">MMK</span>
                        </div>
                        <button 
                          onClick={() => setSelectedBill(bill)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-blue-600/20 w-full sm:w-auto"
                        >
                          Pay Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payment History */}
            <div className="pt-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Payment History</h2>
              <div className="bg-white dark:bg-[#0e1422] rounded-2xl border border-gray-100 dark:border-slate-800 overflow-hidden shadow-sm">
                {paidBills.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-slate-400">No past payments found.</div>
                ) : (
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-slate-900/40 border-b border-gray-100 dark:border-slate-800">
                      <tr>
                        <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-slate-400 tracking-wider uppercase">Bill Details</th>
                        <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-slate-400 tracking-wider uppercase hidden sm:table-cell">Date</th>
                        <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-slate-400 tracking-wider uppercase">Status</th>
                        <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-slate-400 tracking-wider uppercase text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {paidBills.map(bill => (
                        <tr key={bill._id} className="hover:bg-gray-50 dark:bg-slate-900/40/50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-gray-900 dark:text-white text-sm">{bill.title}</p>
                            <p className="text-xs text-gray-500 dark:text-slate-400">{bill.payment_method}</p>
                          </td>
                          <td className="px-6 py-4 hidden sm:table-cell">
                            <span className="text-sm text-gray-500 dark:text-slate-400">
                              {bill.paid_at ? new Date(bill.paid_at).toLocaleDateString() : "-"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {bill.status === "Paid" ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-green-100 text-green-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-orange-100 text-orange-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Processing
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-gray-900 dark:text-white text-sm">
                            {Number(bill.amount).toLocaleString()} <span className="text-xs text-gray-500 dark:text-slate-400">MMK</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

          </div>

          {/* Sidebar / Summary - Right Side */}
          <div className="space-y-6">
            
            {/* Account Summary */}
            <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Wallet size={120} />
              </div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white dark:bg-[#0e1422] opacity-5 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <p className="text-indigo-200 text-sm font-bold tracking-widest uppercase mb-1">Total Outstanding</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <h2 className="text-4xl font-extrabold tracking-tight">{totalDue.toLocaleString()}</h2>
                  <span className="text-indigo-200 font-semibold">MMK</span>
                </div>
                
                <div className="mt-8 pt-8 border-t border-white/10">
                  <p className="text-sm font-medium text-indigo-100">{user?.fullname}</p>
                  <p className="text-xs text-indigo-300 mt-1">Resident ID: {user?.resident_uid || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Support Info */}
            <div className="bg-white dark:bg-[#0e1422] rounded-2xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-slate-900/40 flex items-center justify-center shrink-0">
                  <ShieldCheck className="text-blue-600" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">Secure Payments</h3>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 leading-relaxed">
                    All transactions are verified by property management. Keep your transaction IDs safe.
                  </p>
                  <button className="mt-3 text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">
                    Contact Support <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {selectedBill && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#0e1422] rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {successMsg ? (
              <div className="p-10 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={40} className="text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Sent!</h3>
                <p className="text-gray-500 dark:text-slate-400">{successMsg}</p>
              </div>
            ) : (
              <>
                <div className="px-8 py-6 border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/40/50 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Complete Payment</h3>
                  <button onClick={() => setSelectedBill(null)} className="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:text-slate-300 p-1">✕</button>
                </div>
                
                <div className="p-8">
                  <div className="bg-blue-50 text-blue-800 rounded-2xl p-5 mb-6 flex justify-between items-center border border-blue-100">
                    <div>
                      <p className="text-xs font-bold tracking-widest uppercase opacity-70 mb-1">Amount Due</p>
                      <p className="font-bold">{selectedBill.title}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-extrabold">{Number(selectedBill.amount).toLocaleString()}</p>
                      <p className="text-xs font-bold opacity-70">MMK</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Select Payment Method</p>
                    
                    <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'KBZPay' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 dark:border-slate-700/80 hover:border-gray-300 dark:border-slate-700'}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">K</div>
                        <span className="font-bold text-gray-900 dark:text-white">KBZPay</span>
                      </div>
                      <input type="radio" name="payment" className="w-5 h-5 accent-blue-600" checked={paymentMethod === 'KBZPay'} onChange={() => setPaymentMethod('KBZPay')} />
                    </label>

                    <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'WavePay' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 dark:border-slate-700/80 hover:border-gray-300 dark:border-slate-700'}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center text-white font-bold">W</div>
                        <span className="font-bold text-gray-900 dark:text-white">WavePay</span>
                      </div>
                      <input type="radio" name="payment" className="w-5 h-5 accent-blue-600" checked={paymentMethod === 'WavePay'} onChange={() => setPaymentMethod('WavePay')} />
                    </label>

                    <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'Cash' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 dark:border-slate-700/80 hover:border-gray-300 dark:border-slate-700'}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white">
                          <Banknote size={20} />
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white">Cash / Office</span>
                      </div>
                      <input type="radio" name="payment" className="w-5 h-5 accent-blue-600" checked={paymentMethod === 'Cash'} onChange={() => setPaymentMethod('Cash')} />
                    </label>
                  </div>

                  <button 
                    onClick={handlePay}
                    disabled={isProcessing}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    {isProcessing ? "Processing..." : `Pay ${Number(selectedBill.amount).toLocaleString()} MMK`}
                  </button>
                  <p className="text-center text-xs text-gray-400 dark:text-slate-500 mt-4 font-medium">Secured by InnoCity Trust</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}


