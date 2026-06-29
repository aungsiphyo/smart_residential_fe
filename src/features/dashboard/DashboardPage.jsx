import React, { useState, useEffect } from "react";
import API from "../../services/axios";
import StatsGrid from "./components/StatsGrid";
import VisitorChart from "./components/VisitorChart";
import RevenueCard from "./components/RevenueCard";
import Button from "../../components/ui/Button";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await API.get("/dashboard/stats");
        if (res.data && res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  // Get current date
  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const date = today.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const year = today.getFullYear();

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-[#f8f9fc] dark:bg-transparent rounded-tl-2xl min-h-[calc(100vh-64px)]">
        <p className="text-gray-500 dark:text-slate-400 font-semibold animate-pulse">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fc] dark:bg-transparent font-sans rounded-tl-2xl min-h-[calc(100vh-64px)] p-8">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Urban Pulse Dashboard
          </h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm mt-1.5 font-medium">
            Monitoring life at Civic Precision Villas • {dayName}, {date} {year}
          </p>
        </div>

        <div className="flex gap-2.5">
          <Button variant="secondary" className="bg-white dark:bg-[#0e1422] border-gray-200 dark:border-slate-700/80 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:bg-slate-900/40 font-semibold shadow-sm">
            ↓ Export Data
          </Button>
          <Button variant="primary" className="bg-blue-600 hover:bg-blue-700 font-semibold shadow-sm text-white">
            + New Task
          </Button>
        </div>
      </div>

      {/* STATS */}
      <StatsGrid statsData={data?.stats} />

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* CHART */}
        <div className="lg:col-span-2">
          <VisitorChart chartData={data?.visitorChart} breakdownData={data?.visitorBreakdown} />
        </div>

        {/* REVENUE */}
        <RevenueCard revenueData={data?.revenue} />
      </div>

    </div>
  );
}