import { useState, useEffect } from "react";
import LoginForm from "../components/LoginForm";
import { Building2 } from "lucide-react";
import { translations } from "../utils/translations";
import LanguageToggle from "../components/LanguageToggle";

export default function Login() {
  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");

  useEffect(() => {
    const handleStorageChange = () => {
      setLang(localStorage.getItem("lang") || "en");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const t = translations[lang];

  return (
    <div className="flex min-h-screen w-full bg-slate-50 font-sans">
      
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
          <h1 className="text-4xl xl:text-5xl font-extrabold text-white mt-6 leading-tight">
            {t.headline}
          </h1>
          <p className="text-slate-300 mt-4 text-sm leading-relaxed">
            {t.descriptionLogin}
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

        <LoginForm />
      </div>

    </div>
  );
}
