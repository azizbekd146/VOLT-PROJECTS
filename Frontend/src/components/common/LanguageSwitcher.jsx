import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { ChevronDown } from "lucide-react";

export default function LanguageSwitcher() {
    const { lang, switchLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const languages = [
        { code: "uz", label: "O'zbek" },
        { code: "en", label: "English" },
        { code: "ru", label: "Русский" },
    ];

    // Hozirgi tanlangan tilni topish
    const currentLang = languages.find((l) => l.code === lang) || languages[0];

    // Ochiladigan ro'yxat uchun qolgan tillarni filtrlash
    const otherLanguages = languages.filter((l) => l.code !== currentLang.code);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative z-50" ref={dropdownRef}>
            {/* Faqat hozirgi til ko'rinib turadigan tugma */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 text-slate-300 hover:text-cyan-400 transition-colors font-medium uppercase text-sm px-2 py-1"
            >
                {currentLang.code}
                <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180 text-cyan-400" : ""
                        }`}
                />
            </button>

            {/* Sichqoncha olib borganda chiqadigan menyu */}
            <div
                className={`absolute right-0 top-full mt-1 w-32 overflow-hidden rounded-xl border border-slate-800 bg-slate-900/95 backdrop-blur-sm shadow-xl transition-all duration-200 origin-top-right ${isOpen
                    ? "scale-100 opacity-100 visible"
                    : "scale-95 opacity-0 invisible"
                    }`}
            >
                <div className="py-2">
                    {otherLanguages.map((language) => (
                        <button
                            key={language.code}
                            onClick={() => {
                                switchLanguage(language.code);
                                setIsOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2 text-slate-300 hover:text-slate-50 hover:bg-slate-800"
                        >
                            <span className="uppercase text-xs font-bold text-slate-500 w-5">
                                {language.code}
                            </span>
                            {language.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}