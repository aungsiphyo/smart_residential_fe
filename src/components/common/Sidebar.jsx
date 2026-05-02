import { useLocation, useNavigate } from "react-router-dom";

const menu = [
  { label: "Dashboard", icon: "📊", path: "/" },
  { label: "Rooms", icon: "🏠", path: "/rooms" },
  { label: "Users", icon: "👥", path: "/users" },
  { label: "Visitor Check-in", icon: "📋", path: "/visitor-checkin" },
  { label: "Reports", icon: "📄", path: "/reports" },
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

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col shadow-sm">

      {/* Logo */}
      <div className="p-5 border-b border-gray-200">
        <h1 className="text-lg font-bold text-blue-900 flex items-center gap-2">
          InnoCity <span className="text-sm text-gray-500">Admin</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1">Smart Residential Management</p>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        {menu.map((item) => (
          <button
            key={item.label}
            onClick={() => handleNavigation(item.path)}
            className={`w-full px-4 py-2 rounded-lg cursor-pointer transition flex items-center gap-3 text-left border-none ${
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
        <button className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
          <span className="text-lg">❄️</span>
          <span>Emergency SOS</span>
        </button>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 space-y-1">
        <button
          onClick={() => handleNavigation("/settings")}
          className={`w-full px-4 py-2 rounded-lg cursor-pointer transition flex items-center gap-3 text-left border-none ${
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
          className="w-full px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer transition flex items-center gap-3 text-left border-none"
        >
          <span className="text-lg">🚪</span>
          <span className="text-sm">Logout</span>
        </button>
      </div>

    </aside>
  );
}