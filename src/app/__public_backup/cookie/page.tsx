"use client";

import { motion } from "framer-motion";

const sections = [
  {
    title: "Cookie Policy di MarBel",
    content: [
      "Ultimo aggiornamento: [inserisci data]",
      "Il presente documento descrive l’uso dei cookie sul sito dittamarbel.netlify.app.",
    ],
  },
  {
    title: "1. Cosa sono i cookie",
    content: [
      "I cookie sono piccoli file che il browser memorizza per migliorare la navigazione e alcune funzionalità del sito.",
      "Esistono:",
      "cookie tecnici",
      "cookie statistici",
      "cookie di profilazione",
      "cookie di terze parti",
    ],
  },
  {
    title: "2. Cookie utilizzati da questo sito",
    content: [
      "a) Cookie tecnici",
      "Necessari per il corretto funzionamento del sito.",
      "Non richiedono consenso.",
      "",
      "b) Cookie analitici anonimizzati",
      "Utilizzati solo per statistiche aggregate (es. traffico).",
      "Non identificano l’utente.",
      "",
      "c) Cookie di terze parti",
      "Servizi come Google Fonts, strumenti di hosting o CDN possono generare cookie tecnici.",
      "Non utilizziamo cookie di profilazione.",
    ],
  },
  {
    title: "3. Come gestire i cookie",
    content: [
      "Puoi:",
      "accettarli",
      "rifiutarli",
      "cancellarli dal browser",
      "",
      "Guida ufficiale:",
      "Chrome: https://support.google.com/chrome/answer/95647",
      "Safari: https://support.apple.com/guide/safari/manage-cookies",
      "Firefox: https://support.mozilla.org/kb/cookies-information-websites-store-on-your-computer",
    ],
  },
  {
    title: "4. Modifiche alla cookie policy",
    content: [
      "Potremmo aggiornare periodicamente questa pagina.",
      "Si consiglia di consultarla regolarmente.",
    ],
  },
  {
    title: "5. Contatti",
    content: ["Per dubbi o richieste sui cookie:", "📩 info@marbel.it"],
  },
];

const blockVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function CookiePage() {
  return (
    <main className="min-h-screen bg-[#f5f6fa] text-[#1a2a4e] font-sans">
      <div className="max-w-5xl mx-auto px-6 py-16 space-y-12">
        <header className="text-center space-y-3">
          <h1 className="text-4xl sm:text-5xl font-extrabold">Cookie Policy</h1>
          <p className="text-lg text-[#475569] max-w-2xl mx-auto">
            Informazioni sull’uso dei cookie per gli utenti del sito MarBel.
          </p>
        </header>

        <div className="space-y-10">
          {sections.map((section) => (
            <motion.section
              key={section.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={blockVariants}
              className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 sm:p-8 space-y-4"
            >
              <h2 className="text-2xl font-bold tracking-tight">
                {section.title}
              </h2>
              <div className="space-y-2 text-[#475569] leading-relaxed">
                {section.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </motion.section>
          ))}
        </div>
      </div>
    </main>
  );
}
