"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type CookiePreferences = {
  analytics: boolean;
  marketing: boolean;
};

const CONSENT_KEY = "cookieConsent";
const PREF_KEY = "cookiePreferences";

const defaultPreferences: CookiePreferences = {
  analytics: false,
  marketing: false,
};

function blockScriptsByPreference(prefs: CookiePreferences) {
  const allowAnalytics = prefs.analytics;
  const allowMarketing = prefs.marketing;
  const disallowedCategories = new Set<string>();
  if (!allowAnalytics) disallowedCategories.add("analytics");
  if (!allowMarketing) disallowedCategories.add("marketing");

  if (disallowedCategories.size === 0) return;

  const scripts = document.querySelectorAll<HTMLScriptElement>(
    'script[data-cookie-category]'
  );
  scripts.forEach((script) => {
    const category = script.dataset.cookieCategory;
    if (category && disallowedCategories.has(category)) {
      script.parentElement?.removeChild(script);
    }
  });
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [preferences, setPreferences] =
    useState<CookiePreferences>(defaultPreferences);
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedConsent = localStorage.getItem(CONSENT_KEY);
    const storedPrefs = localStorage.getItem(PREF_KEY);

    if (storedPrefs) {
      try {
        const parsed = JSON.parse(storedPrefs) as CookiePreferences;
        setPreferences({
          analytics: !!parsed.analytics,
          marketing: !!parsed.marketing,
        });
        setVisible(false);
        blockScriptsByPreference(parsed);
        return;
      } catch {
        /* ignore parse errors */
      }
    }

    if (storedConsent === "accepted" || storedConsent === "rejected") {
      setVisible(false);
    } else {
      setVisible(true);
    }
  }, []);

  const acceptAll = () => {
    const prefs: CookiePreferences = { analytics: true, marketing: true };
    setPreferences(prefs);
    localStorage.setItem(CONSENT_KEY, "accepted");
    localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
    setVisible(false);
  };

  const rejectAll = () => {
    const prefs: CookiePreferences = { analytics: false, marketing: false };
    setPreferences(prefs);
    localStorage.setItem(CONSENT_KEY, "rejected");
    localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
    blockScriptsByPreference(prefs);
    setVisible(false);
  };

  const savePreferences = () => {
    localStorage.setItem(CONSENT_KEY, "custom");
    localStorage.setItem(PREF_KEY, JSON.stringify(preferences));
    blockScriptsByPreference(preferences);
    setVisible(false);
    setShowPreferences(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#e2e8f0] p-4 sm:p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#1a2a4e]">
                  Rispettiamo la tua privacy
                </h3>
                <p className="text-sm text-[#475569] leading-relaxed">
                  Utilizziamo cookie tecnici per garantire il corretto
                  funzionamento del sito e, previo tuo consenso, cookie
                  analitici e di marketing per migliorare la tua esperienza.
                  Puoi accettare, rifiutare o personalizzare le tue preferenze.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:min-w-[280px]">
                <button
                  onClick={rejectAll}
                  className="w-full px-4 py-2 rounded-lg border border-[#cbd5e1] text-[#1a2a4e] font-semibold hover:bg-[#f1f5f9] transition-colors"
                >
                  Rifiuta tutto
                </button>
                <button
                  onClick={() => setShowPreferences((prev) => !prev)}
                  className="w-full px-4 py-2 rounded-lg border border-[#e2e8f0] text-[#1a2a4e] font-semibold hover:bg-[#eef2ff] transition-colors"
                >
                  Preferenze
                </button>
                <button
                  onClick={acceptAll}
                  className="w-full px-4 py-2 rounded-lg bg-[#1a2a4e] text-white font-semibold shadow-lg hover:bg-[#223867] transition-colors"
                >
                  Accetta tutto
                </button>
              </div>
            </div>

            <AnimatePresence>
              {showPreferences && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4 border-t border-[#e2e8f0] pt-4 space-y-3"
                >
                  <p className="text-sm text-[#475569]">
                    Cookie tecnici: sempre attivi
                  </p>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#1a2a4e]">
                        Cookie analitici
                      </p>
                      <p className="text-xs text-[#64748b]">
                        Utilizzati per statistiche aggregate.
                      </p>
                    </div>
                    <label className="inline-flex items-center gap-2 text-sm text-[#1a2a4e]">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) =>
                          setPreferences((prev) => ({
                            ...prev,
                            analytics: e.target.checked,
                          }))
                        }
                        className="h-4 w-4 accent-[#1a2a4e]"
                      />
                      Attiva
                    </label>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#1a2a4e]">
                        Cookie marketing
                      </p>
                      <p className="text-xs text-[#64748b]">
                        Per contenuti e offerte personalizzate.
                      </p>
                    </div>
                    <label className="inline-flex items-center gap-2 text-sm text-[#1a2a4e]">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={(e) =>
                          setPreferences((prev) => ({
                            ...prev,
                            marketing: e.target.checked,
                          }))
                        }
                        className="h-4 w-4 accent-[#1a2a4e]"
                      />
                      Attiva
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={() => setShowPreferences(false)}
                      className="px-4 py-2 rounded-lg border border-[#cbd5e1] text-[#1a2a4e] font-semibold hover:bg-[#f1f5f9] transition-colors"
                    >
                      Annulla
                    </button>
                    <button
                      onClick={savePreferences}
                      className="px-4 py-2 rounded-lg bg-[#1a2a4e] text-white font-semibold shadow hover:bg-[#223867] transition-colors"
                    >
                      Salva preferenze
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
