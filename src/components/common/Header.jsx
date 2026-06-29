import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, Settings, LogOut } from "lucide-react";
import useAuthStore from "../../features/auth/authStore";
import { logoutRequest } from "../../features/auth/api";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const authEmail = useAuthStore((state) => state.authEmail);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const [lang, setLangState] = useState(localStorage.getItem("lang") || "en");

  const setLang = (newLang) => {
    localStorage.setItem("lang", newLang);
    setLangState(newLang);
    window.dispatchEvent(new Event("storage"));
  };

  useEffect(() => {
    const handleStorage = () => {
      setLangState(localStorage.getItem("lang") || "en");
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleLogout = async () => {
    try {
      if (authEmail) {
        await logoutRequest(authEmail);
      }
    } catch {
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
    <header className="bg-[#0b0f19] border-b border-slate-800/80 px-8 py-4 flex items-center justify-between transition-colors duration-200">
      {/* Search Bar container with search icon */}
      <div className="flex-1 max-w-md relative flex items-center">
        <Search size={14} className="absolute left-3.5 text-slate-400 pointer-events-none" />
        <input
          className="w-full rounded-lg border border-slate-800 bg-slate-900/40 pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700/60 transition-all text-slate-200 placeholder-slate-500 font-medium"
          placeholder="Search items, database, or settings..."
        />
      </div>

      <div className="flex items-center gap-5">
        {/* Simple Header Language Switcher (EN / MY) */}
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 select-none border-r border-slate-800/60 pr-5">
          <button
            onClick={() => setLang("en")}
            type="button"
            className={`transition cursor-pointer ${
              lang === "en" ? "text-blue-600 font-extrabold" : "hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            EN
          </button>
          <span className="text-slate-500/50">/</span>
          <button
            onClick={() => setLang("my")}
            type="button"
            className={`transition cursor-pointer ${
              lang === "my" ? "text-blue-600 font-extrabold" : "hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            MY
          </button>
        </div>

        {/* Theme Toggle Button */}
        <ThemeToggle />

        {/* Notifications button */}
        <button className="relative text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition flex items-center justify-center p-2 rounded-lg cursor-pointer">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>

        {/* Settings button */}
        <button className="text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition flex items-center justify-center p-2 rounded-lg cursor-pointer">
          <Settings size={18} />
        </button>

        {/* Profile info & logout */}
        <div className="flex items-center gap-3 pl-5 border-l border-slate-800/60">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-200 leading-tight">{displayName}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{displayRole}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Facebook style circular initials avatar wrapper */}
            <div className="w-9 h-9 bg-blue-700 rounded-full flex items-center justify-center text-white font-extrabold select-none text-xs ring-2 ring-blue-700/20 shadow-inner">
              {initials}
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition cursor-pointer flex items-center gap-1.5"
            >
              <LogOut size={12} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
