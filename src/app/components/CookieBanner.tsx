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
  const [preferences, setPreferences] = useState<CookiePreferences>(() => {
    if (typeof window === "undefined") return defaultPreferences;
    const storedPrefs = localStorage.getItem(PREF_KEY);
    if (!storedPrefs) return defaultPreferences;
    try {
      const parsed = JSON.parse(storedPrefs) as CookiePreferences;
      return {
        analytics: !!parsed.analytics,
        marketing: !!parsed.marketing,
      };
    } catch {
      return defaultPreferences;
    }
  });
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    const storedConsent = localStorage.getItem(CONSENT_KEY);
    const storedPrefs = localStorage.getItem(PREF_KEY);
    return !(storedPrefs || storedConsent === "accepted" || storedConsent === "rejected");
  });

  useEffect(() => {
    blockScriptsByPreference(preferences);
  }, [preferences]);

  const rejectAll = () => {
    const prefs: CookiePreferences = { analytics: false, marketing: false };
    setPreferences(prefs);
    localStorage.setItem(CONSENT_KEY, "rejected");
    localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
    setVisible(false);
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
                  <h3 className="text-xl font-bold text-[#317614]">
                    Rispettiamo la tua privacy
                  </h3>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    Utilizziamo cookie tecnici necessari al funzionamento del
                    sito e, solo previo tuo consenso, cookie analitici (Google
                    Analytics con IP anonimizzato) per raccogliere statistiche
                    aggregate e migliorare i nostri servizi. Nessun dato
                    personale viene tracciato senza il tuo consenso. Puoi
                    accettare, rifiutare o modificare le tue preferenze in
                    qualsiasi momento tramite il pulsante &quot;Gestisci preferenze
                    cookie&quot; sempre visibile in basso a sinistra.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:min-w-[280px]">
                  <button
                    onClick={rejectAll}
                    className="w-full px-4 py-2 rounded-lg border border-[#317614] text-[#317614] font-semibold hover:bg-[#f1f5f9] transition-colors"
                  >
                    Rifiuta tutto
                  </button>
                  <button
                    onClick={() => {
                      const prefs: CookiePreferences = {
                        analytics: true,
                        marketing: true,
                      };
                      setPreferences(prefs);
                      localStorage.setItem(CONSENT_KEY, "accepted");
                      localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
                      blockScriptsByPreference(prefs);
                      setVisible(false);
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-[#317614] text-[#317614] font-semibold hover:bg-[#f1f5f9] transition-colors"
                  >
                    Accetta tutto
                  </button>
                </div>
              </div>

              {/* Preferenze rimosso: solo Rifiuta e Accetta */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => {
          setVisible(true);
        }}
        className="fixed left-4 bottom-4 z-[99999] px-4 py-2 rounded-lg border border-[#e2e8f0] bg-white text-[#317614] font-semibold shadow hover:bg-[#f1f5f9] transition-colors text-sm cursor-pointer"
        style={{ display: "block" }}
        aria-label="Gestisci preferenze cookie"
        title="Gestisci preferenze cookie"
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
