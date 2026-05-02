import StatsGrid from "./components/StatsGrid";
import VisitorChart from "./components/VisitorChart";
import RevenueCard from "./components/RevenueCard";
import LiveUpdates from "./components/LiveUpdates";
import AnnouncementList from "./components/AnnouncementList";
import Button from "../../components/ui/Button";

export default function DashboardPage() {
  // Get current date
  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const date = today.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const year = today.getFullYear();

  return (
    <div className="space-y-6">

      {/* HEADER SECTION */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">
            Urban Pulse Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Monitoring life at Civic Precision Villas • {dayName}, {date} {year}
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary">↓ Export Data</Button>
          <Button variant="primary">+ New Task</Button>
        </div>
      </div>

      {/* STATS */}
      <StatsGrid />

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* CHART */}
        <div className="lg:col-span-2">
          <VisitorChart />
        </div>

        {/* REVENUE */}
        <RevenueCard />

      </div>

      {/* LIVE UPDATES & ANNOUNCEMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <LiveUpdates />
        </div>
        <div className="lg:col-span-2">
          <AnnouncementList />
        </div>
      </div>

    </div>
  );
}