import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    if (theme === "light") {
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {/* Butun saytni oq rejimga o'tkazuvchi Global CSS */}
      <style>{`
                html:not(.is-admin) body.light-theme .bg-slate-950 { background-color: #f8fafc !important; }
                html:not(.is-admin) body.light-theme .bg-slate-900 { background-color: #ffffff !important; }
                html:not(.is-admin) body.light-theme .bg-slate-900\\/50 { background-color: rgba(255, 255, 255, 0.7) !important; }
                html:not(.is-admin) body.light-theme .bg-slate-900\\/80 { background-color: rgba(255, 255, 255, 0.8) !important; }
                html:not(.is-admin) body.light-theme .bg-slate-900\\/20 { background-color: rgba(255, 255, 255, 0.4) !important; }
                html:not(.is-admin) body.light-theme .bg-slate-800 { background-color: #f1f5f9 !important; }
                html:not(.is-admin) body.light-theme .bg-slate-800\\/50 { background-color: rgba(241, 245, 249, 0.5) !important; }
                html:not(.is-admin) body.light-theme .bg-slate-800\\/30 { background-color: rgba(241, 245, 249, 0.3) !important; }
                html:not(.is-admin) body.light-theme .text-slate-50 { color: #0f172a !important; }
                html:not(.is-admin) body.light-theme .text-slate-200 { color: #1e293b !important; }
                html:not(.is-admin) body.light-theme .text-slate-300 { color: #334155 !important; }
                html:not(.is-admin) body.light-theme .text-slate-400 { color: #475569 !important; }
                html:not(.is-admin) body.light-theme .text-slate-500 { color: #64748b !important; }
                html:not(.is-admin) body.light-theme .border-slate-800 { border-color: #e2e8f0 !important; }
                html:not(.is-admin) body.light-theme .border-slate-700 { border-color: #cbd5e1 !important; }
                html:not(.is-admin) body.light-theme .placeholder-slate-500::placeholder { color: #94a3b8 !important; }
                html:not(.is-admin) body.light-theme .hover\\:bg-slate-800:hover { background-color: #e2e8f0 !important; }
                html:not(.is-admin) body.light-theme .hover\\:bg-slate-900:hover { background-color: #ffffff !important; }
                html:not(.is-admin) body.light-theme .hover\\:text-slate-50:hover { color: #0f172a !important; }
                html:not(.is-admin) body.light-theme .hover\\:text-white:hover { color: #000000 !important; }
                html:not(.is-admin) body.light-theme .divide-slate-800 > :not([hidden]) ~ :not([hidden]) { border-color: #e2e8f0 !important; }
            `}</style>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
