import React, { useState } from "react";
import { Settings, ShieldCheck, Truck, Mail, ArrowRight, Send } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { t } = useLanguage();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;

    alert(
      `${email} manziliga xat yuborildi:\n\n"Sizga ishonchli battery va akkumlyatorlar kerakmi?"`
    );

    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="relative border-t border-slate-800 bg-slate-950 font-body">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand + trust */}
          <div>
            <a href="#home" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/10 ring-1 ring-cyan-400/40">
                <Settings className="h-5 w-5 text-cyan-400" strokeWidth={2.5} />
              </span>
              <span className="font-display text-lg font-bold tracking-tight text-slate-50">
                VOLT<span className="text-cyan-400">PARTS</span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              Verified spare parts for BYD, Leapmotor, Deepal, and other premium EV brands — matched
              to your exact model.
            </p>
            <div className="mt-5 flex flex-col gap-2 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-cyan-400" /> {t("footerVerifiedFitment")}
              </span>
              <span className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-cyan-400" /> {t("footerDispatch")}
              </span>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h3 className="font-display text-sm font-semibold text-slate-50">{t("footerShop")}</h3>
            <ul className="mt-4 space-y-2.5">
              {t("footerShopLinks").map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-sm text-slate-400 transition hover:text-cyan-300">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="font-display text-sm font-semibold text-slate-50">
              {t("footerSupport")}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {t("footerSupportLinks").map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-sm text-slate-400 transition hover:text-cyan-300">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-display text-sm font-semibold text-slate-50">
              {t("footerNewsletterTitle")}
            </h3>
            <p className="mt-4 text-sm text-slate-400">{t("footerNewsletterDesc")}</p>
            {subscribed ? (
              <p className="mt-4 text-sm text-cyan-300">{t("footerNewsletterSubscribed")}</p>
            ) : (
              <form onSubmit={handleSubscribe} className="mt-4 flex gap-2">
                <div className="relative flex-1">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-full rounded-lg border border-slate-800 bg-slate-900/80 py-2.5 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30"
                  />
                </div>
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-lg bg-cyan-400 text-slate-950 transition hover:bg-cyan-300 active:scale-95"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 border-t border-slate-800 pt-6 sm:flex-row sm:justify-between">
          <p className="font-mono text-xs text-slate-500">
            © {new Date().getFullYear()} VoltParts. {t("footerCopyright")}
          </p>
          <p className="font-mono text-xs text-slate-500">{t("footerBuiltFor")}</p>
        </div>
      </div>

      {/* signature charge-bar */}
      <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
    </footer>
  );
}
