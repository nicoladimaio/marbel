"use client";

import SocialBar from "../../components/SocialBar";
import PreventivoFooter from "../../components/PreventivoFooter";

export default function CookiePage() {
  // Unico blocco testo, padding top per separazione dalla navbar
  return (
    <main className="min-h-screen bg-[#f5f6fa] text-[#1a2a4e] font-sans">
      <SocialBar />
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-16">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-2">
            Cookie Policy
          </h1>
          <p className="text-lg text-[#475569] max-w-2xl mx-auto">
            Informazioni sull’uso dei cookie per gli utenti del sito MarBel.
          </p>
        </header>
        <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 sm:p-8 text-[#475569] leading-relaxed space-y-4">
          <p>
            <b>Ultimo aggiornamento:</b> [inserisci data]
          </p>
          <p>
            Il presente documento descrive l’uso dei cookie sul sito
            dittamarbel.netlify.app. Utilizziamo Google Analytics esclusivamente
            in modalità anonimizzata (IP anonimizzato) per raccogliere
            statistiche aggregate sulle visite. Nessun dato personale viene
            tracciato senza consenso.
          </p>
          <p>
            <b>Tipologie di cookie utilizzati:</b>
            <br />
            <b>a) Cookie tecnici:</b> necessari per il corretto funzionamento
            del sito. Non richiedono consenso.
            <br />
            <b>b) Cookie analitici anonimizzati (Google Analytics):</b>{" "}
            utilizzati solo per statistiche aggregate (es. traffico).
            L’indirizzo IP viene anonimizzato e i dati non consentono
            l’identificazione dell’utente. Questi cookie vengono attivati solo
            previo consenso esplicito tramite il banner.
            <br />
            <b>c) Cookie di terze parti:</b> servizi come Google Fonts,
            strumenti di hosting o CDN possono generare cookie tecnici. Non
            utilizziamo cookie di profilazione.
          </p>
          <p>
            <b>Gestione e revoca del consenso:</b> puoi accettare o rifiutare i
            cookie analitici tramite il banner che compare al primo accesso o
            cliccando su &quot;Gestisci preferenze cookie&quot; in basso a
            sinistra. Puoi revocare o modificare il consenso in qualsiasi
            momento tramite lo stesso pulsante. Puoi inoltre cancellare i cookie
            dal browser.
            <br />
            <b>Guida ufficiale:</b>{" "}
            <a
              href="https://support.google.com/chrome/answer/95647"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chrome
            </a>
            ,{" "}
            <a
              href="https://support.apple.com/guide/safari/manage-cookies"
              target="_blank"
              rel="noopener noreferrer"
            >
              Safari
            </a>
            ,{" "}
            <a
              href="https://support.mozilla.org/kb/cookies-information-websites-store-on-your-computer"
              target="_blank"
              rel="noopener noreferrer"
            >
              Firefox
            </a>
            .
          </p>
          <p>
            <b>Modifiche alla cookie policy:</b> potremmo aggiornare
            periodicamente questa pagina. Si consiglia di consultarla
            regolarmente.
          </p>
          <p>
            <b>Contatti:</b> per dubbi o richieste sui cookie: 📩 info@marbel.it
          </p>
        </div>
      </div>
      <PreventivoFooter />
    </main>
  );
}
