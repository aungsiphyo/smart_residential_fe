import { useNavigate } from "react-router-dom";
import useAuthStore from "../../features/auth/authStore";
import { logoutRequest } from "../../features/auth/api";

export default function Header() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const authEmail = useAuthStore((state) => state.authEmail);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLogout = async () => {
    try {
      if (authEmail) {
        await logoutRequest(authEmail);
      }
    } catch (error) {
      // best-effort logout, always clear local state
    } finally {
      clearAuth();
      navigate("/login", { replace: true });
    }
  };

  const displayName = user?.fullname || "Guest";
  const displayRole = user?.role || "Administrator";
  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex-1 max-w-md">
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-full bg-gray-50 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:bg-white transition"
          placeholder="Search residents, rooms or staff..."
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-gray-600 hover:text-gray-900 transition text-xl">
          🔔
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <button className="text-gray-600 hover:text-gray-900 transition text-xl">⚙️</button>

        <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">{displayName}</p>
            <p className="text-xs text-gray-500">{displayRole}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
              {initials}
            </div>
            <button
              onClick={handleLogout}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
