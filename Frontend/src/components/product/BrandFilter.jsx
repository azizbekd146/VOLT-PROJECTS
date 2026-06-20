import React, { useState, useEffect } from "react";
import { BRANDS } from "../../utils/constants";

export default function BrandFilter({ value = "All", onChange = () => { } }) {
  const [options, setOptions] = useState(["All", ...BRANDS]);

  useEffect(() => {
    const loadBrands = () => {
      const saved = localStorage.getItem("volt_brands");
      if (saved) {
        setOptions(["All", ...JSON.parse(saved)]);
      } else {
        setOptions(["All", ...BRANDS]);
      }
    };
    loadBrands();
    window.addEventListener("storage", loadBrands);
    return () => window.removeEventListener("storage", loadBrands);
  }, []);

  return (
    <div className="flex flex-col gap-2 w-full max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          aria-pressed={value === option}
          className={`w-full text-left rounded-xl px-4 py-3 text-sm font-semibold transition-all ${value === option
            ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.1)]"
            : "bg-slate-900/50 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
        >
          {option === "All" ? "Barcha Brendlar" : option}
        </button>
      ))}
    </div>
  );
}
