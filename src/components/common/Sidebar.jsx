import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  LayoutDashboard, 
  Home, 
  Users, 
  UserCheck, 
  FileText, 
  Megaphone, 
  Bell, 
  AlertTriangle, 
  DollarSign, 
  Wrench, 
  Car, 
  Settings, 
  LogOut 
} from "lucide-react";
import useAuthStore from "../../features/auth/authStore";

const API_BASE_URL = "http://localhost:5001/api";

const menu = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Rooms", icon: Home, path: "/rooms" },
  { label: "Users", icon: Users, path: "/users" },
  { label: "Visitor Check-in", icon: UserCheck, path: "/visitor-checkin" },
  { label: "Reports", icon: FileText, path: "/reports" },
  { label: "Advertisements", icon: Megaphone, path: "/advertisements" },
  { label: "Notifications", icon: Bell, path: "/notifications" },
  { label: "Announcements", icon: Megaphone, path: "/announcements" },
  { label: "SOS Alerts", icon: AlertTriangle, path: "/sos" },
  { label: "Bill Payments", icon: DollarSign, path: "/bills" },
  { label: "Helpers", icon: Wrench, path: "/helpers" },
  { label: "Car Parking", icon: Car, path: "/parking" },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);

  const [sendingSOS, setSendingSOS] = useState(false);

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleEmergencySOS = async () => {
    try {
      setSendingSOS(true);

      const response = await axios.post(`${API_BASE_URL}/sos/emergency`, {
        title: "🚨 Emergency SOS Alert",
        message:
          "Emergency alert has been issued by the administration. Please stay safe and follow instructions.",
        level: "Critical",
      });

      console.log(response.data);

      alert("🚨 Emergency SOS sent successfully to all users!");
    } catch (err) {
      console.error("SOS Error:", err);

      alert(
        err?.response?.data?.message || "Failed to send Emergency SOS alert.",
      );
    } finally {
      setSendingSOS(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const visibleMenu = menu.filter(item => {
    if (user?.role === "Admin" || user?.role === "Staff") return true;
    const allowedForCitizen = [
      "/", "/visitor-checkin", "/notifications", 
      "/announcements", "/sos", "/bills", "/parking"
    ];
    return allowedForCitizen.includes(item.path);
  });

  return (
    <aside className="w-64 bg-theme-sidebar text-slate-700 dark:text-slate-300 hidden md:flex flex-col border-r border-theme-border transition-all duration-200">
      {/* Logo Section */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-md font-bold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
          InnoCity
          <span className="text-[10px] font-bold tracking-wider uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">
            {user?.role || "Citizen"}
          </span>
        </h1>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold mt-1.5">
          Residential Platform
        </p>
      </div>

      {/* Navigation Menu */}
      <nav className="p-3.5 space-y-1 flex-1 overflow-y-auto">
        {visibleMenu.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
             <button
              key={item.label}
              onClick={() => handleNavigation(item.path)}
              className={`w-full px-3 py-2 rounded-lg transition-all duration-155 flex items-center gap-2.5 text-left border-none cursor-pointer group ${
                active
                  ? "bg-blue-600 text-white dark:bg-blue-600/20 dark:text-white dark:border-l-2 dark:border-blue-600 font-medium shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <Icon size={16} className={active ? "text-white" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors"} />
              <span className="text-sm tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Emergency SOS Button */}
      <div className="p-3.5 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={handleEmergencySOS}
          disabled={sendingSOS}
          className={`w-full px-3.5 py-2.5 rounded-lg text-white font-medium transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer ${
            sendingSOS
              ? "bg-red-500/40 cursor-not-allowed text-white/50"
              : "bg-red-600 hover:bg-red-700 shadow-xs"
          }`}
        >
          <AlertTriangle size={16} />
          <span className="text-sm">{sendingSOS ? "Sending SOS..." : "Emergency SOS"}</span>
        </button>
      </div>

      {/* Footer Settings & Logout */}
      <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 space-y-0.5">
        <button
          onClick={() => handleNavigation("/settings")}
          className={`w-full px-3 py-2 rounded-lg transition-all duration-155 flex items-center gap-2.5 text-left border-none cursor-pointer group ${
            isActive("/settings")
              ? "bg-blue-600 text-white dark:bg-blue-600/20 dark:text-white dark:border-l-2 dark:border-blue-600 font-medium"
              : "text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Settings size={16} className={isActive("/settings") ? "text-white" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors"} />
          <span className="text-sm tracking-tight">Settings</span>
        </button>

        <button
          onClick={handleLogout}
          className="w-full px-3 py-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-150 flex items-center gap-2.5 text-left border-none cursor-pointer group"
        >
          <LogOut size={16} className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
          <span className="text-sm tracking-tight">Logout</span>
        </button>
      </div>
    </aside>
  );
}
