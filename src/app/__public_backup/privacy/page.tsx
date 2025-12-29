import { motion } from "framer-motion";
import PreventivoFooter from "../components/PreventivoFooter";

const sections = [
  {
    title: "Privacy Policy di MarBel",
    content: [
      "Ultimo aggiornamento: [inserisci data]",
      "La presente informativa descrive le modalità di trattamento dei dati personali degli utenti che visitano il sito dittamarbel.netlify.app o inviano una richiesta tramite il modulo di contatto o preventivo.",
      "Il trattamento avviene nel rispetto del Regolamento UE 679/2016 (GDPR) e della normativa italiana vigente.",
    ],
  },
  {
    title: "1. Titolare del trattamento",
    content: [
      "MarBel – Impresa Edile",
      "Email: info@marbel.it",
      "Telefono: 02 12345678",
    ],
  },
  {
    title: "2. Tipologie di dati trattati",
    content: [
      "Trattiamo i seguenti dati:",
      "a) Dati forniti volontariamente",
      "Quando compili un form (contatti, preventivo, informazioni), raccogliamo:",
      "Nome e cognome",
      "Email",
      "Numero di telefono",
      "Indirizzo (se fornito)",
      "Testo del messaggio o dettagli del progetto",
      "b) Dati di navigazione",
      "In modo automatico (come tutti i siti web):",
      "indirizzo IP",
      "tipo di browser",
      "data e ora della visita",
      "pagine visitate",
      "c) Cookie",
      "Tecnici, analitici e di terze parti. (Vedi Cookie Policy dedicata)",
    ],
  },
  {
    title: "3. Finalità del trattamento",
    content: [
      "I dati vengono utilizzati per:",
      "Rispondere alle richieste inviate tramite modulo o email",
      "Inviare un preventivo o ricontattare l’utente",
      "Migliorare l’esperienza sul sito tramite statistiche anonime",
      "Adempiere ad obblighi di legge",
    ],
  },
  {
    title: "4. Base giuridica",
    content: [
      "Esecuzione di misure precontrattuali → rispondere alle richieste",
      "Consenso → per eventuali comunicazioni future",
      "Interesse legittimo → sicurezza e funzionamento del sito",
    ],
  },
  {
    title: "5. Modalità di trattamento",
    content: [
      "I dati sono trattati con strumenti informatici e protetti da misure di sicurezza tecniche e organizzative adeguate.",
      "Non utilizziamo processi automatizzati decisionali né profilazione.",
    ],
  },
  {
    title: "6. Conservazione dei dati",
    content: [
      "Conserviamo i dati per:",
      "12 mesi per richieste tramite modulo",
      "10 anni se diventano documenti amministrativi/contrattuali",
    ],
  },
  {
    title: "7. Comunicazione dei dati",
    content: [
      "I dati non vengono venduti o ceduti.",
      "Possono essere comunicati esclusivamente a:",
      "fornitori di servizi tecnici (hosting, email)",
      "professionisti in caso di obblighi fiscali/legali",
    ],
  },
  {
    title: "8. Trasferimenti all’estero",
    content: [
      "Alcuni servizi tecnici (es. hosting o email) potrebbero avere server fuori UE.",
      "Utilizziamo solo fornitori conformi allo standard GDPR / SCC.",
    ],
  },
  {
    title: "9. Diritti dell’utente",
    content: [
      "Puoi chiedere in qualsiasi momento:",
      "accesso ai tuoi dati",
      "rettifica",
      "cancellazione",
      "limitazione del trattamento",
      "portabilità",
      "opposizione",
      "Scrivendo a: info@marbel.it",
    ],
  },
  {
    title: "10. Contatti",
    content: [
      "Per qualunque informazione puoi scrivere a:",
      "📩 info@marbel.it",
    ],
  },
];

const titleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f5f6fa] text-[#1a2a4e] font-sans">
      <div className="max-w-5xl mx-auto px-6 py-16 space-y-12">
        <header className="text-center space-y-3 pt-hero-landscape pt-24">
          <h1 className="text-4xl sm:text-5xl font-extrabold">
            Privacy Policy
          </h1>
          <p className="text-lg text-[#475569] max-w-2xl mx-auto">
            Informazioni sul trattamento dei dati personali per gli utenti del
            sito MarBel.
          </p>
        </header>

        <section className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 sm:p-8 space-y-6">
          {sections.map((section, index) => (
            <div key={section.title} className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight mt-8 first:mt-0">
                {section.title}
              </h2>
              <div className="space-y-1 text-[#475569] leading-relaxed">
                {section.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>
          ))}
        </section>
        <div className="mt-16">{/* Footer con contatti e link utili */}</div>
      </div>
      <PreventivoFooter />
    </main>
  );
}
