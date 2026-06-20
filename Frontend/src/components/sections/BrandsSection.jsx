import React, { useState } from "react";
import { Car, Zap, ShieldCheck, Cpu, X, BatteryCharging, Gauge } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext"; // Adjust path if necessary

const BRAND_ICONS = {
  BYD: Zap,
  Tesla: Cpu,
  Zeekr: Car,
  "Li Auto": ShieldCheck,
  NIO: Zap,
  Xpeng: Cpu,
  Leapmotor: Car,
  Deepal: ShieldCheck,
};

const BRAND_COLORS = {
  BYD: { color: "from-blue-500/10 to-transparent", hover: "hover:border-blue-500/50" },
  Tesla: { color: "from-red-500/10 to-transparent", hover: "hover:border-red-500/50" },
  Zeekr: { color: "from-orange-500/10 to-transparent", hover: "hover:border-orange-500/50" },
  "Li Auto": { color: "from-emerald-500/10 to-transparent", hover: "hover:border-emerald-500/50" },
  NIO: { color: "from-teal-500/10 to-transparent", hover: "hover:border-teal-500/50" },
  Xpeng: { color: "from-indigo-500/10 to-transparent", hover: "hover:border-indigo-500/50" },
  Leapmotor: { color: "from-cyan-500/10 to-transparent", hover: "hover:border-cyan-500/50" },
  Deepal: { color: "from-violet-500/10 to-transparent", hover: "hover:border-violet-500/50" },
};

export default function BrandsSection() {
  const [selectedBrand, setSelectedBrand] = useState(null);
  const { t } = useLanguage();

  const EV_BRANDS = t("evBrands"); // Get translated brand data

  return (
    <section
      id="brands"
      className="py-20 bg-slate-950 font-body border-t border-slate-800 relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      <div className="absolute top-0 left-1/2 h-32 w-1/2 -translate-x-1/2 bg-cyan-500/5 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold text-slate-50 sm:text-4xl">
            {t("brandsTitle").split(" ").slice(0, -1).join(" ")}{" "}
            <span className="text-cyan-400">{t("brandsTitle").split(" ").pop()}</span>
          </h2>
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto text-lg">{t("brandsDesc")}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {EV_BRANDS.map((brand, idx) => {
            const Icon = BRAND_ICONS[brand.name]; // Get icon from local map
            const brandStyles = BRAND_COLORS[brand.name]; // Get colors from local map
            return (
              <button
                key={idx}
                onClick={() =>
                  setSelectedBrand({
                    ...brand,
                    icon: Icon,
                    color: brandStyles.color,
                    hover: brandStyles.hover,
                  })
                }
                className={`group w-full text-left relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b ${brandStyles.color} p-6 sm:p-8 transition-all duration-300 ${brandStyles.hover} hover:-translate-y-1 hover:shadow-2xl hover:bg-slate-800/50 cursor-pointer`}
              >
                <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="rounded-full bg-slate-900/80 p-3 shadow-inner group-hover:scale-110 transition-transform duration-300 border border-slate-800 group-hover:border-slate-700">
                    <Icon className="h-6 w-6 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-200 group-hover:text-white transition-colors">
                      {brand.name}
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm font-medium uppercase tracking-wider text-slate-500 group-hover:text-slate-400 transition-colors">
                      {brand.desc} {/* This is already translated as part of evBrands */}
                    </p>
                  </div>
                </div>

                {/* Decorative background element */}
                <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-slate-800/30 blur-2xl group-hover:bg-cyan-500/10 transition-colors" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Car Detail Modal */}
      {selectedBrand && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 sm:p-6 backdrop-blur-md transition-opacity"
          onClick={() => setSelectedBrand(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto overflow-x-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedBrand(null)}
              className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-950/60 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Image Side */}
            <div className="md:w-1/2 h-64 md:h-auto relative shrink-0 bg-slate-950">
              <img
                src={selectedBrand.car.image}
                alt={selectedBrand.car.model}
                className="h-full w-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent md:bg-gradient-to-r md:from-transparent md:to-slate-900" />
            </div>

            {/* Content Side */}
            <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-center relative">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`inline-flex rounded-lg bg-gradient-to-br ${selectedBrand.color} border border-slate-800 p-2`}
                >
                  <selectedBrand.icon className="h-5 w-5 text-cyan-400" />
                </span>
                <h3 className="text-xl font-medium text-slate-400">{selectedBrand.name}</h3>
              </div>

              <h4 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
                {selectedBrand.car.model}
              </h4>
              <p className="text-slate-300 leading-relaxed mb-8">{selectedBrand.car.description}</p>

              <div className="grid grid-cols-2 gap-4 mt-auto">
                <div className="rounded-xl bg-slate-950/50 border border-slate-800 p-4 hover:border-cyan-500/50 transition-colors">
                  <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                    <BatteryCharging className="h-4 w-4" /> {t("brandCarRange")}
                  </div>
                  <div className="text-2xl font-bold text-cyan-400">
                    {selectedBrand.car.range} {t("brandCarRangeUnit")}
                  </div>
                </div>
                <div className="rounded-xl bg-slate-950/50 border border-slate-800 p-4 hover:border-cyan-500/50 transition-colors">
                  <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                    <Gauge className="h-4 w-4" /> {t("brandCarAcceleration")}
                  </div>
                  <div className="text-2xl font-bold text-cyan-400">
                    {selectedBrand.car.acceleration}
                    {t("brandCarAccelerationUnit")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
