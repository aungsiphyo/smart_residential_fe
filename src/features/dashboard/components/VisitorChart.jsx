import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp } from "lucide-react";
import Button from "../../../components/ui/Button";

// Fallback Mock Data
const fallbackMonthlyData = [
  { name: "JAN", thisYear: 35, lastYear: 25 },
  { name: "FEB", thisYear: 30, lastYear: 18 },
  { name: "MAR", thisYear: 45, lastYear: 24 },
  { name: "APR", thisYear: 22, lastYear: 14 },
  { name: "MAY", thisYear: 15, lastYear: 10 },
  { name: "JUN", thisYear: 32, lastYear: 18 },
  { name: "JUL", thisYear: 43, lastYear: 29 },
  { name: "AUG", thisYear: 30, lastYear: 23 },
  { name: "SEP", thisYear: 33, lastYear: 24 },
  { name: "OCT", thisYear: 50, lastYear: 36 },
  { name: "NOV", thisYear: 19, lastYear: 12 },
  { name: "DEC", thisYear: 36, lastYear: 26 },
];

const fallbackVisitorBreakdown = [
  { name: "Scheduled", value: 68, color: "#2563eb" }, 
  { name: "Walk-in", value: 32, color: "#60a5fa" },
];

export default function VisitorChart({ chartData, breakdownData }) {
  const barData = chartData || fallbackMonthlyData;
  const pieData = breakdownData || fallbackVisitorBreakdown;

  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  return (
    <div className="bg-white dark:bg-[#0e1422] p-6 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2 tracking-tight">
            Visitor Traffic Analysis
            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded border border-emerald-100">
              <TrendingUp size={11} /> +12.5% YoY
            </span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 font-medium">
            Comparing entry/exit flows and check-in registrations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" className="text-xs bg-white dark:bg-[#0e1422] border-gray-200 dark:border-slate-700/80 text-gray-700 dark:text-slate-300 shadow-sm hover:bg-gray-50 dark:bg-slate-900/40">
            Filter: Year-To-Date
          </Button>
        </div>
      </div>

      {/* Main Charts Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Bar Chart Container */}
        <div className="xl:col-span-2 h-72">
          <p className="text-xs font-bold text-gray-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
            Monthly Visitor Volume (Thousands)
          </p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="name" 
                tickLine={false} 
                axisLine={false} 
                stroke="#64748b" 
                fontSize={11}
                fontWeight={500}
              />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                stroke="#64748b" 
                fontSize={11}
                fontWeight={500}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#ffffff", 
                  borderRadius: "8px", 
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                }}
                labelStyle={{ fontWeight: "bold", color: "#0f172a" }}
              />
              <Legend 
                verticalAlign="top" 
                height={36} 
                iconType="circle" 
                iconSize={8}
                wrapperStyle={{ fontSize: "12px", fontWeight: 500, color: "#64748b" }}
              />
              <Bar 
                dataKey="thisYear" 
                name={`${currentYear} (Current)`} 
                fill="#2563eb" 
                radius={[4, 4, 0, 0]} 
                barSize={12}
              />
              <Bar 
                dataKey="lastYear" 
                name={`${previousYear} (Previous)`} 
                fill="#60a5fa" 
                radius={[4, 4, 0, 0]} 
                barSize={12}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart Container */}
        <div className="flex flex-col justify-center border-t xl:border-t-0 xl:border-l border-gray-100 dark:border-slate-800 pt-6 xl:pt-0 xl:pl-6">
          <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 mb-4 uppercase tracking-wider text-center">
            Check-In Types Share
          </p>
          <div className="h-44 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `${value}%`}
                  contentStyle={{ 
                    backgroundColor: "#ffffff", 
                    borderRadius: "8px", 
                    border: "1px solid #e2e8f0" 
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center label */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">YTD</span>
              <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">Distribution</span>
            </div>
          </div>

          {/* Pie Chart Legend */}
          <div className="mt-4 flex justify-center gap-6">
            {pieData.map((entry) => (
              <div key={entry.name} className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <p className="text-xs font-semibold text-gray-700 dark:text-slate-300">{entry.name}</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-400 ml-5">{entry.value}%</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}