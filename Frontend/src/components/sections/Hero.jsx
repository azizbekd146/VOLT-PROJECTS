import React from "react";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function Hero({ onBrowseClick }) {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28">
      {/* Orqa fon uchun yengil nur effekti */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          {/* Chap tomon - Katta Matnlar */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-slate-50">
              {t("heroTitle")}
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-400 mx-auto lg:mx-0 leading-relaxed">
              {t("heroDesc")}
            </p>
            <div className="mt-8 flex justify-center gap-4 lg:justify-start">
              <button
                onClick={onBrowseClick}
                className="flex items-center gap-2 rounded-full bg-cyan-500 px-8 py-4 text-sm font-bold text-slate-950 transition-all hover:bg-cyan-400 active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
              >
                {t("heroBtn")}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* O'ng tomon - 4 ta rasm (2x2 grid, yopishgan) */}
          <div className="flex-1 w-full max-w-md lg:max-w-[480px] mx-auto">
            <div className="grid grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <img
                src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=600"
                alt="Tesla"
                className="w-full h-40 sm:h-52 object-cover hover:scale-105 transition-transform duration-300"
              />
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ33egDiIqIPEg39V5u7QS-7ljmuExoeMRPHDxfXjmYoXBcuPpZlNxD72k&s=10"
                alt="BYD"
                className="w-full h-40 sm:h-52 object-cover hover:scale-105 transition-transform duration-300"
              />
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQucNgca4nqy-pLP1USmtQdyDM-aWRtxVOZ0kG1HHu91r6-52374TJLLlja&s=10"
                alt="Leapmotor"
                className="w-full h-40 sm:h-52 object-cover hover:scale-105 transition-transform duration-300"
              />
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQ03NJghHnOuAQcdwBhb6mdmgbRHkvm8NrnsyZzUViUDmrxNkUY7dpeY-T&s=10"
                alt="Li Auto"
                className="w-full h-40 sm:h-52 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
