"use client";

const CONSENT_KEY = "cookie_consent";
const PREF_KEY = "cookie_preferences";

type CookiePreferences = {
  analytics: boolean;
  marketing: boolean;
};

const defaultPreferences: CookiePreferences = {
  analytics: false,
  marketing: false,
};

import { useEffect, useState } from "react";

// Helper to add/remove scripts by id
function manageScript({
  id,
  src,
  shouldAdd,
}: {
  id: string;
  src: string;
  shouldAdd: boolean;
}) {
  if (typeof window === "undefined") return;
  const existing = document.getElementById(id);
  if (shouldAdd) {
    if (!existing) {
      const script = document.createElement("script");
      script.id = id;
      script.src = src;
      script.async = true;
      script.type = "text/javascript";
      document.head.appendChild(script);
    }
  } else {
    if (existing) {
      existing.remove();
    }
  }
}

// Main function to block/unblock scripts based on preferences
function blockScriptsByPreference(prefs: CookiePreferences) {
  // Example: Google Analytics (gtag.js)
  // Replace with your real analytics/marketing scripts as needed
  const analyticsSrc =
    "https://www.googletagmanager.com/gtag/js?id=G-9XVFDV1CDN";
  const analyticsInitId = "gtag-init";

  // Analytics
  if (prefs.analytics) {
    // Add gtag.js if not present
    manageScript({ id: "gtag-js", src: analyticsSrc, shouldAdd: true });
    // Add inline gtag init if not present
    if (!document.getElementById(analyticsInitId)) {
      const script = document.createElement("script");
      script.id = analyticsInitId;
      script.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-9XVFDV1CDN', { anonymize_ip: true });
      `;
      document.head.appendChild(script);
    }
  } else {
    // Remove analytics scripts
    manageScript({ id: "gtag-js", src: analyticsSrc, shouldAdd: false });
    const initScript = document.getElementById(analyticsInitId);
    if (initScript) initScript.remove();
    // Optionally clear analytics cookies here
  }

  // Marketing (example: Facebook Pixel, add as needed)
  // ...
}
import { motion, AnimatePresence } from "framer-motion";

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
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-x-0 bottom-4 z-[9999] flex justify-center px-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl border border-[#e2e8f0] p-6 sm:p-10"
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
                    Puoi accettare, rifiutare o personalizzare le tue
                    preferenze.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:min-w-[280px]">
                  <button
                    onClick={rejectAll}
                    className="w-full px-4 py-2 rounded-lg border border-[#1a2a4e] text-[#1a2a4e] font-semibold hover:bg-[#f1f5f9] transition-colors"
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
                    className="w-full px-4 py-2 rounded-lg border border-[#1a2a4e] text-[#1a2a4e] font-semibold hover:bg-[#f1f5f9] transition-colors"
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
      <button
        onClick={() => {
          setVisible(true);
          setShowPreferences(false);
        }}
        className="fixed right-4 bottom-4 z-[99999] px-4 py-2 rounded-lg border border-[#e2e8f0] bg-white text-[#1a2a4e] font-semibold shadow hover:bg-[#f1f5f9] transition-colors text-sm"
        style={{ display: "block" }}
        aria-label="Gestisci preferenze cookie"
        title="Gestisci preferenze cookie"
        className="fixed left-4 bottom-4 z-[99999] px-4 py-2 rounded-lg border border-[#e2e8f0] bg-white text-[#1a2a4e] font-semibold shadow hover:bg-[#f1f5f9] transition-colors text-sm cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path d="M12 2a10 10 0 1 0 10 10c0-.34-.02-.67-.05-1a1 1 0 0 0-1.11-.89 2.5 2.5 0 0 1-2.94-2.94A1 1 0 0 0 16 6.05c-.33-.03-.66-.05-1-.05A10 10 0 0 0 12 2zm-2 13a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm-3-2a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm8 4a1 1 0 1 1 2 0 1 1 0 0 1-2 0z" />
        </svg>
      </button>
    </>
  );
}
