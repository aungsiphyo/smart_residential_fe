import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api";

const menu = [
  { label: "Dashboard", icon: "📊", path: "/" },
  { label: "Rooms", icon: "🏠", path: "/rooms" },
  { label: "Users", icon: "👥", path: "/users" },
  { label: "Visitor Check-in", icon: "📋", path: "/visitor-checkin" },
  { label: "Reports", icon: "📄", path: "/reports" },
  { label: "Advertisements", icon: "🏷️", path: "/advertisements" },
  { label: "Notifications", icon: "🔔", path: "/notifications" },
  { label: "Announcements", icon: "📢", path: "/announcements" },
  { label: "SOS Alerts", icon: "⚠️", path: "/sos" },
  { label: "Bill Payments", icon: "💳", path: "/bills" },
  { label: "Helpers", icon: "🧑‍💼", path: "/helpers" },
  { label: "Car Parking", icon: "🅿️", path: "/parking" },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

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

  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col shadow-sm">
      {/* Logo Section */}
      <div className="p-5 border-b border-gray-200">
        <h1 className="text-lg font-bold text-blue-900 flex items-center gap-2">
          InnoCity
          <span className="text-sm text-gray-500">Admin</span>
        </h1>

        <p className="text-xs text-gray-500 mt-1">
          Smart Residential Management
        </p>
      </div>

      {/* Navigation Menu */}
      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        {menu.map((item) => (
          <button
            key={item.label}
            onClick={() => handleNavigation(item.path)}
            className={`w-full px-4 py-2 rounded-lg transition flex items-center gap-3 text-left border-none cursor-pointer ${
              isActive(item.path)
                ? "bg-blue-50 text-blue-900 font-semibold border-l-4 border-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Emergency SOS Button */}
      <div className="p-3 border-t border-gray-200">
        <button
          onClick={handleEmergencySOS}
          disabled={sendingSOS}
          className={`w-full px-4 py-3 rounded-lg text-white font-semibold transition flex items-center justify-center gap-2 ${
            sendingSOS
              ? "bg-red-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          <span className="text-lg">🚨</span>

          <span>{sendingSOS ? "Sending Alert..." : "Emergency SOS"}</span>
        </button>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 space-y-1">
        <button
          onClick={() => handleNavigation("/settings")}
          className={`w-full px-4 py-2 rounded-lg transition flex items-center gap-3 text-left border-none cursor-pointer ${
            isActive("/settings")
              ? "bg-gray-100 text-gray-900 font-semibold"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <span className="text-lg">⚙️</span>
          <span className="text-sm">Settings</span>
        </button>

        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition flex items-center gap-3 text-left border-none cursor-pointer"
        >
          <span className="text-lg">🚪</span>
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}
