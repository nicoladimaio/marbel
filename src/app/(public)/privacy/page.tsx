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
  // ...altre sezioni...
];

export default function Privacy() {
  return (
    <main className="min-h-screen bg-[#f5f6fa] text-[#1a2a4e]">
      {/* ...contenuto privacy... */}
    </main>
  );
}
