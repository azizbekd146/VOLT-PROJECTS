import React from "react";
import { BrainCircuit, ShieldCheck, Layers, BellRing } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";

export default function AdvantagesSection() {
    const { t } = useLanguage();
    const { theme } = useTheme();

    const advantages = [
        {
            id: 1,
            title: t("adv1Title"),
            desc: t("adv1Desc"),
            icon: BrainCircuit,
            color: "text-purple-400",
            bg: "bg-purple-500/10",
            border: "border-purple-500/20"
        },
        {
            id: 2,
            title: t("adv2Title"),
            desc: t("adv2Desc"),
            icon: ShieldCheck,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20"
        },
        {
            id: 3,
            title: t("adv3Title"),
            desc: t("adv3Desc"),
            icon: Layers,
            color: "text-cyan-400",
            bg: "bg-cyan-500/10",
            border: "border-cyan-500/20"
        },
        {
            id: 4,
            title: t("adv4Title"),
            desc: t("adv4Desc"),
            icon: BellRing,
            color: "text-amber-400",
            bg: "bg-amber-500/10",
            border: "border-amber-500/20"
        }
    ];

    return (
        <section className={`py-20 ${theme === "light" ? "bg-white" : "bg-slate-900/20"}`}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className={`font-display text-3xl md:text-4xl font-bold mb-4 ${theme === "light" ? "text-slate-900" : "text-slate-50"}`}>{t("advTitle")}</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">{t("advDesc")}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {advantages.map((adv) => {
                        const Icon = adv.icon;
                        return (
                            <div key={adv.id} className={`p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group ${theme === "light" ? "bg-slate-50 border-slate-200 hover:border-cyan-300" : "bg-slate-900 border-slate-800 hover:border-slate-700"} ${adv.border}`}>
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${adv.bg} ${adv.color}`}>
                                    <Icon className="w-7 h-7" />
                                </div>
                                <h3 className={`text-lg font-bold mb-3 ${theme === "light" ? "text-slate-800" : "text-slate-100"}`}>{adv.title}</h3>
                                <p className={`text-sm leading-relaxed ${theme === "light" ? "text-slate-600" : "text-slate-400"}`}>{adv.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}