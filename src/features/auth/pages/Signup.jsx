import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Lock, Briefcase, Home, Building2, ShieldAlert, ChevronDown } from "lucide-react";
import { useAuthActions } from "../hooks";
import { translations } from "../utils/translations";
import LanguageToggle from "../components/LanguageToggle";

export default function Signup() {
  const navigate = useNavigate();
  const { signUp } = useAuthActions();
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [roomId, setRoomId] = useState("");
  const [role, setRole] = useState("Citizen");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");

  useEffect(() => {
    const handleStorageChange = () => {
      setLang(localStorage.getItem("lang") || "en");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const t = translations[lang];

  const roles = [
    { value: "Citizen", label: t.roleCitizen },
    { value: "Admin", label: t.roleAdmin },
    { value: "Staff", label: t.roleStaff },
    { value: "Security", label: t.roleSecurity }
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signUp({ fullname, email, phone, password, role, room_id: roomId });
      navigate("/login", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || t.signupError
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50 font-sans relative">
      
      {/* LEFT COLUMN: Features Panel (Hidden on Mobile/Tablet) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 p-12 flex-col justify-between relative overflow-hidden dark-panel">
        
        {/* Glow element */}
        <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-blue-500/10 blur-[80px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-indigo-500/10 blur-[80px]" />

        {/* Top: Logo & Title */}
        <div className="relative z-10">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <div className="bg-blue-600 p-2 rounded-xl text-white flex items-center justify-center">
              <Building2 size={20} />
            </div>
            {t.brandTitle}
          </h2>
          <p className="text-blue-200/60 text-xs mt-1.5 ml-0.5">{t.brandSubtitle}</p>
        </div>

        {/* Center: Headline */}
        <div className="relative z-10 my-auto max-w-lg">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-3.5 py-1 rounded-full border border-blue-500/20">
            {t.welcomeBadge}
          </span>
          <h1 className="text-4xl xl:text-5xl font-extrabold text-white mt-6 leading-tight animate-fade-in">
            {t.headline}
          </h1>
          <p className="text-slate-300 mt-4 text-sm leading-relaxed">
            {t.descriptionSignup}
          </p>

          {/* Mini Stats Grid */}
          <div className="grid grid-cols-2 gap-6 mt-12 border-t border-white/10 pt-8">
            <div>
              <p className="text-3xl font-extrabold text-white">{t.residentsCount}</p>
              <p className="text-xs text-slate-400 mt-1">{t.activeResidents}</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white">{t.uptimePercentage}</p>
              <p className="text-xs text-slate-400 mt-1">{t.systemUptime}</p>
            </div>
          </div>
        </div>

        {/* Bottom: Footer */}
        <div className="relative z-10 text-xs text-slate-500">
          {t.copyright}
        </div>
      </div>

      {/* RIGHT COLUMN: Form Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 md:p-16 relative">
        
        {/* Language selector toggle */}
        <LanguageToggle />

        {/* Mobile Header (Hidden on Desktop) */}
        <div className="lg:hidden mb-8 text-center flex flex-col items-center">
          <div className="bg-blue-600 p-2.5 rounded-xl text-white flex items-center justify-center shadow-md">
            <Building2 size={24} />
          </div>
          <h2 className="text-xl font-bold text-blue-900 tracking-tight mt-3">
            {t.brandTitle}
          </h2>
          <p className="text-slate-500 text-xs mt-1">{t.brandSubtitle}</p>
        </div>

        <div className="w-full max-w-md bg-white rounded-xl p-8 border border-zinc-200/80">
          <div className="mb-6">
            <h1 className="text-xl font-bold tracking-tight text-zinc-900">{t.createAccount}</h1>
            <p className="text-zinc-500 text-sm mt-1.5 leading-relaxed">
              {t.signupSubtitle}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            
            {/* Full Name */}
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-zinc-500">{t.fullName}</label>
              <div className="relative flex items-center">
                <User size={15} className="absolute left-3.5 text-zinc-400" />
                <input
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  required
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50/10 pl-10 pr-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition-all text-zinc-800 placeholder-zinc-400"
                  placeholder={t.fullNamePlaceholder}
                />
              </div>
            </div>

            {/* Grid for Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-zinc-500">{t.emailAddress}</label>
                <div className="relative flex items-center">
                  <Mail size={15} className="absolute left-3.5 text-zinc-400" />
                  <input
                    value={email}
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50/10 pl-10 pr-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition-all text-zinc-800 placeholder-zinc-400"
                    placeholder={t.emailPlaceholder}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-zinc-500">{t.phone}</label>
                <div className="relative flex items-center">
                  <Phone size={15} className="absolute left-3.5 text-zinc-400" />
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50/10 pl-10 pr-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition-all text-zinc-800 placeholder-zinc-400"
                    placeholder={t.phonePlaceholder}
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-zinc-500">{t.password}</label>
              <div className="relative flex items-center">
                <Lock size={15} className="absolute left-3.5 text-zinc-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50/10 pl-10 pr-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition-all text-zinc-800 placeholder-zinc-400"
                  placeholder={t.passwordPlaceholder}
                />
              </div>
            </div>

            {/* Grid for Role & Room */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-zinc-500">{t.role}</label>
                <div className="relative flex items-center">
                  <Briefcase size={15} className="absolute left-3.5 text-zinc-400 pointer-events-none" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                    className="w-full rounded-lg border border-zinc-200 pl-10 pr-10 py-2.5 text-sm font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition bg-white text-zinc-800 cursor-pointer"
                  >
                    {roles.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-4 text-zinc-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-zinc-500">{t.roomArea}</label>
                <div className="relative flex items-center">
                  <Home size={15} className="absolute left-3.5 text-zinc-400" />
                  <input
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    required
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50/10 pl-10 pr-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition-all text-zinc-800 placeholder-zinc-400"
                    placeholder={t.roomPlaceholder}
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error ? (
              <div className="p-3 bg-red-50 border border-red-200/50 rounded-lg flex items-center gap-2">
                <ShieldAlert size={15} className="text-red-600 flex-shrink-0" />
                <p className="text-xs font-semibold text-red-800">{error}</p>
              </div>
            ) : null}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-700 py-2.5 text-sm font-medium text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-700/50 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer text-center"
            >
              {loading ? t.registeringButton : t.registerButton}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-5 text-center text-sm text-zinc-500 font-medium">
            {t.alreadyHaveAccount}{" "}
            <button
              onClick={() => navigate("/login")}
              className="font-semibold text-blue-700 hover:text-blue-800 hover:underline border-none bg-transparent cursor-pointer"
            >
              {t.signInLink}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
