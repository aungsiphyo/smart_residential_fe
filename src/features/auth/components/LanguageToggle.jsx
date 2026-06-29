import { useState, useEffect } from "react";

export default function LanguageToggle() {
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

  return (
    <div className="absolute top-6 right-8 z-50 flex items-center gap-2 text-sm font-semibold text-slate-400 select-none">
      <button
        onClick={() => setLang("en")}
        type="button"
        className={`transition duration-150 cursor-pointer ${
          lang === "en" ? "text-blue-700 font-bold" : "hover:text-slate-600"
        }`}
      >
        EN
      </button>
      <span className="text-slate-300">/</span>
      <button
        onClick={() => setLang("my")}
        type="button"
        className={`transition duration-150 cursor-pointer ${
          lang === "my" ? "text-blue-700 font-bold" : "hover:text-slate-600"
        }`}
      >
        MY
      </button>
    </div>
  );
}
