import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ShieldAlert } from "lucide-react";
import { useAuthActions } from "../hooks";
import { translations } from "../utils/translations";

export default function LoginForm() {
  const navigate = useNavigate();
  const { loginPassword } = useAuthActions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginPassword({ email, password });
      navigate("/otp", { state: { email } });
    } catch (err) {
      setError(
        err.response?.data?.message || t.loginError
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full max-w-md bg-white rounded-xl p-8 border border-zinc-200/80 relative">
      
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-tight text-zinc-900">{t.welcomeBack}</h1>
        <p className="text-zinc-500 text-sm mt-1.5 leading-relaxed">
          {t.loginSubtitle}
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        
        {/* Email */}
        <div>
          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-zinc-500">{t.emailAddress}</label>
          <div className="relative flex items-center">
            <Mail size={15} className="absolute left-3.5 text-zinc-400" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50/10 pl-10 pr-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition-all text-zinc-800 placeholder-zinc-400"
              placeholder={t.emailPlaceholder}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-zinc-500">{t.password}</label>
          <div className="relative flex items-center">
            <Lock size={15} className="absolute left-3.5 text-zinc-400" />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50/10 pl-10 pr-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition-all text-zinc-800 placeholder-zinc-400"
              placeholder="••••••••"
            />
          </div>
        </div>

        {/* Error messaging */}
        {error ? (
          <div className="p-3 bg-red-50 border border-red-200/50 rounded-lg flex items-center gap-2">
            <ShieldAlert size={15} className="text-red-600 flex-shrink-0" />
            <p className="text-xs font-semibold text-red-800">{error}</p>
          </div>
        ) : null}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-700 py-2.5 text-sm font-medium text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-700/50 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          {loading ? t.sendingOtp : t.sendOtp}
        </button>
      </form>

      {/* Signup Link */}
      <div className="mt-5 text-center text-sm text-zinc-500 font-medium">
        {t.dontHaveAccount}{" "}
        <Link to="/signup" className="font-semibold text-blue-700 hover:text-blue-800 hover:underline">
          {t.signUpLink}
        </Link>
      </div>
    </div>
  );
}
