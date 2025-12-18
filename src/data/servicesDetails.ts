import { IconType } from "react-icons";
import {
  FiDroplet,
  FiTool,
  FiLayers,
  FiPackage,
  FiZap,
  FiGrid,
  FiShield,
  FiCpu,
  FiCheckCircle,
} from "react-icons/fi";

export type ServiceDescriptionBlock = {
  title: string;
  text: string;
  icon: IconType;
};

export type ServiceDetails = {
  title: string;
  subtitle: string;
  heroImage: string;
  portfolioCategory: string;
  descriptionBlocks: ServiceDescriptionBlock[];
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButtonText: string;
};

export const servicesDetails: Record<string, ServiceDetails> = {
  ristrutturazioni: {
    title: "Ristrutturazioni complete",
    subtitle:
      "Gestiamo demolizioni, impianti e finiture con un unico project manager e timeline certa.",
    heroImage: "/hero-servizi-new.jpg",
    portfolioCategory: "Tutti",
    descriptionBlocks: [
      {
        title: "Project management",
        text: "Coordinamento squadre, fornitori e pratiche per un cantiere fluido e senza ritardi.",
        icon: FiLayers,
      },
      {
        title: "Impianti integrati",
        text: "Sincronizziamo impianti idraulici, elettrici e domotica per performance e sicurezza.",
        icon: FiTool,
      },
      {
        title: "Finiture premium",
        text: "Materiali certificati, posa sartoriale e controllo qualitativo in ogni ambiente.",
        icon: FiCheckCircle,
      },
    ],
    ctaTitle: "Organizza la tua ristrutturazione completa",
    ctaSubtitle:
      "Dallo studio preliminare alla consegna chiavi in mano, hai un referente unico e tempi certi.",
    ctaButtonText: "Pianifica un sopralluogo",
  },
  bagni: {
    title: "Bagni su misura",
    subtitle:
      "Wellness domestico con rivestimenti tecnici, illuminazione scenografica e accessori coordinati.",
    heroImage: "/gallery2.jpg",
    portfolioCategory: "Bagni",
    descriptionBlocks: [
      {
        title: "Impermeabilizzazione sartoriale",
        text: "Rivestimenti waterproof e sigillature certificate per ambienti sempre protetti.",
        icon: FiDroplet,
      },
      {
        title: "Installazione controllata",
        text: "Posa di sanitari, docce walk-in e rubinetterie con squadre interne specializzate.",
        icon: FiTool,
      },
      {
        title: "Design coordinato",
        text: "Moodboard condivise per combinare superfici, luci e accessori in modo coerente.",
        icon: FiLayers,
      },
    ],
    ctaTitle: "Trasforma il tuo bagno in una spa domestica",
    ctaSubtitle:
      "Dalla progettazione al collaudo, coordiniamo forniture e impianti per un risultato sartoriale.",
    ctaButtonText: "Richiedi preventivo bagno",
  },
  cucine: {
    title: "Cucine su misura",
    subtitle:
      "Layout funzionali, integrazione degli elettrodomestici e finiture premium per la zona living.",
    heroImage: "/gallery3.jpg",
    portfolioCategory: "Cucine",
    descriptionBlocks: [
      {
        title: "Progettazione condivisa",
        text: "Disegni esecutivi, rendering e ottimizzazione degli spazi per una cucina ergonomica.",
        icon: FiPackage,
      },
      {
        title: "Finiture premium",
        text: "Top tecnici, legni certificati e laccature custom selezionate con il cliente.",
        icon: FiShield,
      },
      {
        title: "Montaggio integrato",
        text: "Squadre dedicate gestiscono installazione, collaudi e regolazioni finali.",
        icon: FiTool,
      },
    ],
    ctaTitle: "Progetta la tua cucina su misura",
    ctaSubtitle:
      "Materiali coordinati, illuminazione integrata e montaggio seguito da un project manager unico.",
    ctaButtonText: "Pianifica il progetto cucina",
  },
  idraulici: {
    title: "Impianti idraulici",
    subtitle:
      "Realizziamo e adeguiamo impianti idrici certificati con materiali ad alte prestazioni.",
    heroImage: "/cantiere.jpg",
    portfolioCategory: "Impianti idraulici",
    descriptionBlocks: [
      {
        title: "Analisi e tracciamento",
        text: "Studio dei percorsi e bilanciamento pressioni per impianti efficienti e silenziosi.",
        icon: FiLayers,
      },
      {
        title: "Materiali certificati",
        text: "Tubazioni multistrato, raccorderia testata e valvole di sicurezza di fascia premium.",
        icon: FiCheckCircle,
      },
      {
        title: "Collaudo e manutenzione",
        text: "Test di tenuta, report fotografici e programmi di manutenzione programmata.",
        icon: FiTool,
      },
    ],
    ctaTitle: "Adegua o rinnova il tuo impianto idraulico",
    ctaSubtitle:
      "Dalla distribuzione all'allaccio finale, gestiamo pratiche, materiali e collaudi.",
    ctaButtonText: "Prenota un sopralluogo",
  },
  elettrici: {
    title: "Impianti elettrici",
    subtitle:
      "Quadri, distribuzione, illuminazione e domotica nel rispetto delle normative CEI.",
    heroImage: "/hero-servizi-new.jpg",
    portfolioCategory: "Impianti elettrici",
    descriptionBlocks: [
      {
        title: "Progettazione CEI",
        text: "Quadri e linee dimensionati su misura con documentazione completa e dichiarazioni di conformita.",
        icon: FiZap,
      },
      {
        title: "Domotica e sicurezza",
        text: "Integrazione di sensori, smart switch e sistemi anti-intrusione per il controllo totale.",
        icon: FiCpu,
      },
      {
        title: "Collaudo finale",
        text: "Misurazioni, verifiche di carico e consegna schemi aggiornati dell'impianto.",
        icon: FiCheckCircle,
      },
    ],
    ctaTitle: "Metti in sicurezza il tuo impianto elettrico",
    ctaSubtitle:
      "Progettiamo, installiamo e certifichiamo linee, illuminazione e domotica con tempi garantiti.",
    ctaButtonText: "Richiedi un tecnico",
  },
  pavimenti: {
    title: "Pavimenti e rivestimenti",
    subtitle:
      "Posa sartoriale di superfici tecniche e naturali per ambienti interni ed esterni.",
    heroImage: "/gallery4.jpg",
    portfolioCategory: "Pavimenti",
    descriptionBlocks: [
      {
        title: "Studio delle superfici",
        text: "Scelta di formati, fughe e schemi di posa per armonizzare gli ambienti.",
        icon: FiGrid,
      },
      {
        title: "Posa artigianale",
        text: "Tagli di precisione, livelli controllati e trattamenti protettivi post-posa.",
        icon: FiTool,
      },
      {
        title: "Coordinamento finiture",
        text: "Scale, battiscopa e rivestimenti verticali coordinati al progetto d'insieme.",
        icon: FiLayers,
      },
    ],
    ctaTitle: "Rinnova le superfici con finiture sartoriali",
    ctaSubtitle:
      "Dal massetto alla posa, seguiamo ogni fase per ottenere continuita visiva e durabilita.",
    ctaButtonText: "Parla con un posatore",
  },
};
