"use client";
import Image from "next/image";
import SocialBar from "./components/SocialBar";
import { useEffect, useState } from "react";
import {
  useScroll,
  useTransform,
  motion,
  AnimatePresence,
  cubicBezier,
} from "framer-motion";
import ServiceCarousel from "./components/ServiceCarousel";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { FaCheckCircle, FaHardHat, FaRedo, FaTools } from "react-icons/fa";

export default function Home() {
  const cardReveal = (delay = 0) => ({
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.85, delay, ease: cubicBezier(0.16, 1, 0.3, 1) },
  });
  const [showContent, setShowContent] = useState(false);
  const [tabIndex, setTab] = useState(0);
  const [offers, setOffers] = useState<
    { id: string; titolo: string; descrizione: string; immagine?: string }[]
  >([]);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    const fetchOffers = async () => {
      const querySnapshot = await getDocs(collection(db, "offerte"));
      setOffers(
        querySnapshot.docs.map((doc) => {
          const data = doc.data() as {
            titolo: string;
            descrizione: string;
            immagine?: string;
          };
          return {
            id: doc.id,
            titolo: data.titolo,
            descrizione: data.descrizione,
            immagine: data.immagine,
          };
        })
      );
    };
    fetchOffers();
    return () => clearTimeout(timer);
  }, []);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 700], [0, -150]);

  const scrollReveal = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: cubicBezier(0.16, 1, 0.3, 1) },
    },
  };
  const cardParallax = useTransform(scrollY, [0, 1200], [6, -3]);

  const expertiseTabs = [
    {
      title: "Ristrutturazioni chiavi in mano",
      description:
        "Soluzioni complete che integrano progettazione, permessi, coordinamento fornitori e consegna puntuale dell'opera finita.",
      badge: "Project management completo",
      cover: "/gallery1.jpg",
      bullets: [
        "Direzione lavori e gestione squadre certificate",
        "Unico interlocutore per il cliente in ogni fase",
        "Aggiornamenti digitali su avanzamento e costi",
      ],
    },
    {
      title: "Interior design & finiture premium",
      description:
        "Studio dei materiali, render fotorealistici e selezione di collezioni Made in Italy pensate per valorizzare gli ambienti.",
      badge: "Design su misura",
      cover: "/gallery2.jpg",
      bullets: [
        "Consulenza su palette colore e illuminazione",
        "Partnership con fornitori certificati",
        "Mockup 3D e moodboard interattive",
      ],
    },
    {
      title: "Riqualificazione energetica",
      description:
        "Efficienza, comfort e risparmio con interventi certificati Ecobonus e Superbonus, dagli impianti termici al cappotto.",
      badge: "Cantieri sostenibili",
      cover: "/gallery3.jpg",
      bullets: [
        "Analisi termografica e pratiche ENEA",
        "Impianti domotici e smart monitoring",
        "Assistenza nella gestione degli incentivi",
      ],
    },
  ];

  const safeTabIndex = Math.min(tabIndex, expertiseTabs.length - 1);
  const selectedTab = expertiseTabs[safeTabIndex];

  const processSteps = [
    {
      title: "Briefing e sopralluogo",
      description:
        "Analizziamo esigenze, budget e tempistiche per proporre una visione concreta del progetto.",
    },
    {
      title: "Progettazione tecnica",
      description:
        "Render, capitolati e cronoprogramma dettagliato condiviso su area riservata.",
    },
    {
      title: "Realizzazione e controllo qualit��",
      description:
        "Coordinamento artigiani, verifiche periodiche e report fotografici.",
    },
    {
      title: "Consegna e assistenza",
      description:
        "Collaudo finale, documentazione digitale e supporto post-intervento.",
    },
  ];

  const testimonials = [
    {
      quote:
        "Lavoro impeccabile, controllo totale sul cantiere e tempi rispettati al minuto.",
      author: "Francesca, Milano",
      role: "Ristrutturazione appartamento",
    },
    {
      quote:
        "Ci hanno guidati passo dopo passo nella riqualificazione energetica, ora consumiamo il 40% in meno.",
      author: "Luca & Martina",
      role: "Villa privata",
    },
  ];

  const serviceHighlights = [
    "Squadre specializzate coordinate da un unico project manager",
    "Report fotografici, timeline e costi disponibili su area riservata",
    "Gestione pratiche fiscali, bonus e soluzioni finanziarie dedicate",
  ];

  const fallbackOffers = [
    {
      id: "off1",
      titolo: "Bagno boutique completo",
      descrizione:
        "Finiture in pietra sinterizzata, box trasparente e accessoristica premium installata in 20 giorni.",
      immagine: "/gallery1.jpg",
    },
    {
      id: "off2",
      titolo: "Cucina su misura smart",
      descrizione:
        "Pensili in rovere, top tecnico e integrazione domotica con adeguamento impianti incluso.",
      immagine: "/gallery2.jpg",
    },
    {
      id: "off3",
      titolo: "Riqualificazione energetica",
      descrizione:
        "Cappotto termico, infissi triplo vetro e pratiche bonus seguite dal nostro studio tecnico.",
      immagine: "/gallery3.jpg",
    },
  ];

  const highlightOffers = (offers.length ? offers : fallbackOffers).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#f5f6fa] font-sans">
      {/* Social vertical bar */}
      <SocialBar />
      <AnimatePresence>
        {showContent && (
          <>
            {/* HERO SECTION */}
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="w-full p-0 m-0"
            >
              <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
                {/* Background image with subtle parallax */}
                <motion.div
                  className="absolute inset-0 z-0"
                  style={{ y: heroY }}
                  id="hero-bg-parallax"
                >
                  <Image
                    src="/sfondo.jpg"
                    alt="Sfondo hero"
                    fill
                    priority
                    className="object-cover object-center"
                  />
                </motion.div>

                {/* Overlay gradient (sottile e professionale) */}
                <div
                  className="absolute inset-0 z-5 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(26,42,78,0.35) 0%, rgba(26,42,78,0.08) 35%, rgba(255,255,255,0) 80%)",
                    transition: "opacity 0.8s ease",
                  }}
                  aria-hidden
                />

                {/* Content stack: logo, title, subtitle, cta */}
                <div className="relative z-10 flex flex-col items-center justify-center gap-4 text-center px-4">
                  {/* Logo (la tua immagine rimane) */}
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.25,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Image
                      src="/logo.png"
                      alt="Logo"
                      width={240}
                      height={80}
                      priority
                      className="mb-4 drop-shadow-md"
                    />
                  </motion.div>

                  {/* Title: reveal letter-block style (simple translate+opacity) */}
                  <motion.h1
                    initial={{
                      opacity: 0,
                      y: 26,
                      clipPath: "inset(100% 0 0 0)",
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      clipPath: "inset(0% 0 0 0)",
                    }}
                    transition={{
                      duration: 0.95,
                      delay: 0.4,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="text-5xl sm:text-6xl font-extrabold text-[#1a2a4e] tracking-tight mb-2"
                    style={{
                      textShadow: "0 2px 12px #fff, 0 1px 2px #e0e0e0",
                    }}
                  >
                    Costruiamo il tuo futuro
                  </motion.h1>

                  {/* Subtitle / badge (slightly different reveal & emphasis) */}
                  <motion.span
                    initial={{ opacity: 0, y: 20, letterSpacing: "0.35em" }}
                    animate={{ opacity: 1, y: 0, letterSpacing: "0.15em" }}
                    transition={{
                      duration: 0.95,
                      delay: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="text-xl sm:text-2xl text-white font-bold px-4 py-2 rounded-xl"
                    style={{
                      textShadow:
                        "0 2px 8px rgba(0, 0, 0, 0.7), 0 0px 2px #000000ff, 1px 1px 0 #000000ff, -1px -1px 0 #000000ff",
                    }}
                  >
                    RICHIEDI ORA UN PREVENTIVO GRATUITO E SENZA IMPEGNO
                  </motion.span>

                  {/* CTAs: styled and animated */}
                  <motion.div
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.85 }}
                    className="mt-6 flex flex-col sm:flex-row gap-4 items-center"
                  >
                    <motion.a
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      href="/preventivo"
                      className="px-10 py-3 rounded-xl bg-[#1a2a4e] text-white font-semibold shadow-lg hover:bg-[#274472] transition-all duration-250 text-lg"
                    >
                      Calcola ora
                    </motion.a>

                    <motion.a
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      href="/contatti"
                      className="px-8 py-3 rounded-xl border border-white text-white font-semibold hover:bg-white/10 transition-all duration-250 text-lg"
                    >
                      Contattaci
                    </motion.a>
                  </motion.div>
                </div>
              </div>
            </motion.section>

            {/* EXPERTISE TABS */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={scrollReveal}
              className="py-20 bg-white"
            >
              <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-start">
                <div className="space-y-6">
                  <span className="text-sm font-semibold tracking-[0.4em] uppercase text-[#7c8cab]">
                    Metodo
                  </span>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A2A4E] leading-tight">
                    Strategia, design e cantieri controllati con un'unica regia.
                  </h2>
                  <p className="text-lg text-[#3a4a5a] leading-relaxed">
                    Seleziona un focus per vedere come accompagniamo privati e
                    aziende nel trasformare gli spazi.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    {expertiseTabs.map((tab, index) => (
                      <button
                        key={tab.title}
                        type="button"
                        onClick={() => setTab(index)}
                        className={`rounded-2xl border px-5 py-5 text-left transition-all ${
                          safeTabIndex === index
                            ? "border-[#1A2A4E] bg-[#1A2A4E] text-white shadow-lg shadow-[#1A2A4E]/30"
                            : "border-[#e1e5ef] bg-white text-[#1A2A4E] hover:border-[#cbd3e3]"
                        }`}
                      >
                        <p
                          className={`text-xs uppercase tracking-[0.35em] ${
                            safeTabIndex === index
                              ? "text-white/70"
                              : "text-[#7c8cab]"
                          }`}
                        >
                          {tab.badge}
                        </p>
                        <p className="text-lg font-semibold mt-2">
                          {tab.title}
                        </p>
                      </button>
                    ))}
                  </div>

                  <div className="bg-[#f5f6fa] rounded-2xl p-6 space-y-4 border border-[#e1e5ef] shadow-inner">
                    <p className="text-lg font-semibold text-[#1A2A4E]">
                      {selectedTab.badge}
                    </p>
                    <p className="text-[#3a4a5a] leading-relaxed">
                      {selectedTab.description}
                    </p>
                    <ul className="space-y-3">
                      {selectedTab.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex items-start gap-3 text-sm"
                        >
                          <FaCheckCircle className="text-[#00c6ff] mt-1" />
                          <span className="text-[#1A2A4E]">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="w-full space-y-6 md:mt-10 lg:mt-16">
                  <div className="relative h-[320px] sm:h-[420px] rounded-[32px] overflow-hidden shadow-2xl border border-[#e6ebf5]">
                    <Image
                      src={selectedTab.cover}
                      alt={selectedTab.title}
                      fill
                      className="object-cover w-full h-full"
                      sizes="(max-width: 768px) 100vw, 480px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020710]/80 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <span className="text-xs tracking-[0.4em] uppercase text-white/70">
                        {selectedTab.badge}
                      </span>
                      <h3 className="text-2xl font-bold mt-2">
                        {selectedTab.title}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* PERCH�% SCEGLIERCI */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={scrollReveal}
              className="py-20 bg-[#f4f6fb]"
            >
              <div className="max-w-7xl mx-auto px-6 space-y-10">
                <div className="text-center space-y-4">
                  <p className="text-sm uppercase tracking-[0.4em] text-[#7c8cab]">
                    Valori
                  </p>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A2A4E]">
                    Perchè sceglierci
                  </h2>
                  <p className="text-[#3a4a5a] text-lg max-w-3xl mx-auto">
                    Processi digitali, squadre dedicate e supervisione continua
                    trasformano ogni progetto in un cantiere orchestrato al
                    millimetro.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <motion.div
                    {...cardReveal(0)}
                    className="rounded-3xl border border-white bg-white shadow-xl p-8"
                    style={{ y: cardParallax, transformPerspective: 1200 }}
                    whileHover={{
                      rotateX: 1,
                      rotateY: -1,
                      boxShadow: "0 25px 60px -35px rgba(26,42,78,0.45)",
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -24 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.1,
                        ease: cubicBezier(0.22, 1, 0.36, 1),
                      }}
                      viewport={{ once: true, amount: 0.6 }}
                    >
                      <FaHardHat className="text-4xl text-[#1A2A4E] mb-4" />
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0, x: 22 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.18,
                        ease: cubicBezier(0.22, 1, 0.36, 1),
                      }}
                      viewport={{ once: true, amount: 0.6 }}
                      className="text-xl font-semibold uppercase tracking-wide mb-3 text-[#1A2A4E]"
                    >
                      Professionalità
                    </motion.h3>
                    <p className="text-[#3a4a5a] leading-relaxed">
                      Direzione lavori certificata, squadre coordinate e
                      aggiornamenti su dashboard condivisa.
                    </p>
                  </motion.div>

                  <motion.div
                    {...cardReveal(0.12)}
                    className="rounded-3xl border border-white bg-white shadow-xl p-8"
                    style={{ y: cardParallax, transformPerspective: 1200 }}
                    whileHover={{
                      rotateX: 1,
                      rotateY: -1,
                      boxShadow: "0 25px 60px -35px rgba(26,42,78,0.45)",
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -24 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.15,
                        ease: cubicBezier(0.22, 1, 0.36, 1),
                      }}
                      viewport={{ once: true, amount: 0.6 }}
                    >
                      <FaTools className="text-4xl text-[#1A2A4E] mb-4" />
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0, x: 22 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.22,
                        ease: cubicBezier(0.22, 1, 0.36, 1),
                      }}
                      viewport={{ once: true, amount: 0.6 }}
                      className="text-xl font-semibold uppercase tracking-wide mb-3 text-[#1A2A4E]"
                    >
                      Qualità
                    </motion.h3>
                    <p className="text-[#3a4a5a] leading-relaxed">
                      Materiali certificati, partner selezionati e mockup prima
                      di andare in produzione.
                    </p>
                  </motion.div>

                  <motion.div
                    {...cardReveal(0.24)}
                    className="rounded-3xl border border-white bg-white shadow-xl p-8"
                    style={{ y: cardParallax, transformPerspective: 1200 }}
                    whileHover={{
                      rotateX: 1,
                      rotateY: -1,
                      boxShadow: "0 25px 60px -35px rgba(26,42,78,0.45)",
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -24 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.2,
                        ease: cubicBezier(0.22, 1, 0.36, 1),
                      }}
                      viewport={{ once: true, amount: 0.6 }}
                    >
                      <FaRedo className="text-4xl text-[#1A2A4E] mb-4" />
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0, x: 22 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.27,
                        ease: cubicBezier(0.22, 1, 0.36, 1),
                      }}
                      viewport={{ once: true, amount: 0.6 }}
                      className="text-xl font-semibold uppercase tracking-wide mb-3 text-[#1A2A4E]"
                    >
                      Affidabilità
                    </motion.h3>
                    <p className="text-[#3a4a5a] leading-relaxed">
                      Preventivi chiari, milestone approvate dal cliente e
                      garanzia scritta sui lavori eseguiti.
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.section>

            {/* SERVIZI */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={scrollReveal}
              className="py-20 bg-gradient-to-b from-[#0d1b2a] to-[#1a2a4e] text-white"
            >
              <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1fr,1.2fr] gap-12 items-center">
                <div className="space-y-6">
                  <p className="text-sm tracking-[0.4em] uppercase text-white/60">
                    Servizi
                  </p>
                  <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
                    Dalla progettazione al collaudo, ogni fase ha una squadra
                    dedicata.
                  </h2>
                  <p className="text-lg text-white/80">
                    Scopri le lavorazioni disponibili e naviga tra le proposte
                    pensate per cucine, bagni, pavimenti e impianti.
                  </p>
                  <ul className="space-y-3">
                    {serviceHighlights.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-white/90"
                      >
                        <FaCheckCircle className="mt-1 text-[#8de8ff]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-4 pt-4">
                    <a
                      href="/servizi"
                      className="px-8 py-3 rounded-2xl bg-white text-[#1a2a4e] font-semibold shadow-xl hover:bg-blue-50 transition-all duration-300"
                    >
                      Scopri tutti i servizi
                    </a>
                    <a
                      href="/portfolio"
                      className="px-8 py-3 rounded-2xl border border-white/50 text-white font-semibold hover:bg-white/10 transition-all duration-300"
                    >
                      Guarda i lavori
                    </a>
                  </div>
                </div>
                <div className="bg-white/5 rounded-[32px] p-6 backdrop-blur border border-white/10 shadow-2xl">
                  <ServiceCarousel />
                </div>
              </div>
            </motion.section>

            {/* OFFERTE */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={scrollReveal}
              className="py-20 bg-[#F7F7F7]"
            >
              <div className="max-w-7xl mx-auto px-6 space-y-12">
                <div className="text-center space-y-4">
                  <p className="text-sm uppercase tracking-[0.4em] text-[#7c8cab]">
                    Offerte
                  </p>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A2A4E]">
                    Offerte attive
                  </h2>
                  <p className="text-lg text-[#3a4a5a] max-w-3xl mx-auto">
                    Promo dedicate su bagni, cucine e riqualificazioni per
                    partire subito con il tuo progetto.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  {highlightOffers.map((offer, index) => {
                    const fallbackImage =
                      fallbackOffers[index % fallbackOffers.length]?.immagine ??
                      `/gallery${index + 1}.jpg`;
                    const imageSrc = offer.immagine || fallbackImage;

                    return (
                      <motion.div
                        key={offer.id}
                        whileHover={{ translateY: -6 }}
                        className="bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col h-full"
                      >
                        <div className="relative h-48 w-full">
                          <Image
                            src={imageSrc}
                            alt={offer.titolo}
                            fill
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        </div>
                        <div className="p-6 flex flex-col gap-3 flex-1">
                          <h3 className="text-xl font-bold text-[#1A2A4E]">
                            {offer.titolo}
                          </h3>
                          <p className="text-[#3a4a5a] text-sm flex-1">
                            {offer.descrizione}
                          </p>
                          <a
                            href="/offerte"
                            className="inline-flex items-center gap-2 text-[#1A2A4E] font-semibold"
                          >
                            Scopri i dettagli <span aria-hidden>&rarr;</span>
                          </a>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.section>

            {/* TESTIMONIANZE */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={scrollReveal}
              className="py-20 bg-[#0d1b2a] text-white"
            >
              <div className="max-w-6xl w-full mx-auto px-6 text-center space-y-10">
                <div>
                  <p className="text-sm uppercase tracking-[0.4em] text-white/50">
                    Feedback
                  </p>
                  <h2 className="text-3xl md:text-4xl font-extrabold mt-2">
                    Le parole di chi ci ha scelto
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {testimonials.map((testimonial, index) => (
                    <motion.div
                      key={testimonial.author}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 border border-white/10 rounded-3xl p-6 text-left shadow-xl backdrop-blur"
                    >
                      <p className="text-lg italic text-white/90 leading-relaxed">
                        "{testimonial.quote}"
                      </p>
                      <div className="mt-6">
                        <p className="text-xl font-bold">
                          {testimonial.author}
                        </p>
                        <p className="text-sm text-white/70">
                          {testimonial.role}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* CTA FINALE con effetto parallax */}
            <section
              className="w-full flex flex-col items-center justify-center py-16 px-4 bg-[url('/sfondo.jpg')] bg-cover bg-center bg-fixed relative"
              style={{ minHeight: "300px" }}
            >
              <div className="max-w-2xl w-full mx-auto text-center flex flex-col items-center justify-center relative z-10">
                <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">
                  Vuoi un preventivo gratuito?
                </h2>
                <p className="text-white text-lg mb-8 drop-shadow-lg">
                  Contattaci ora e ricevi una consulenza personalizzata per il
                  tuo progetto.
                </p>
                <a
                  href="/preventivo"
                  className="px-8 py-3 rounded-xl bg-white text-[#1a2a4e] font-semibold shadow-lg hover:bg-blue-100 transition-all duration-300 text-lg"
                >
                  Richiedi preventivo
                </a>
              </div>
              <div className="absolute inset-0 bg-black/10 z-0" />
            </section>

            {/* CONTATTI E INFO */}
            <section className="w-full flex flex-col items-center py-12 px-4 bg-white border-t border-gray-200">
              <div className="max-w-4xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-[#1a2a4e] mb-4">
                    Contattaci
                  </h3>
                  <ul className="text-[#3a4a5a] text-lg space-y-2">
                    <li>
                      <strong>Indirizzo:</strong> Via Roma 123, 20100 Milano
                      (MI)
                    </li>
                    <li>
                      <strong>Telefono:</strong>{" "}
                      <a
                        href="tel:+390212345678"
                        className="text-blue-700 hover:underline"
                      >
                        02 12345678
                      </a>
                    </li>
                    <li>
                      <strong>Email:</strong>{" "}
                      <a
                        href="mailto:info@marbel.it"
                        className="text-blue-700 hover:underline"
                      >
                        info@marbel.it
                      </a>
                    </li>
                    <li>
                      <strong>Orari:</strong> Lun-Ven 9:00-18:00
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col gap-4 justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-[#1a2a4e] mb-2">
                      Link utili
                    </h4>
                    <ul className="text-[#3a4a5a] space-y-1">
                      <li>
                        <a href="/privacy" className="hover:underline">
                          Privacy Policy
                        </a>
                      </li>
                      <li>
                        <a href="/cookie" className="hover:underline">
                          Cookie Policy
                        </a>
                      </li>
                      <li>
                        <a href="/contatti" className="hover:underline">
                          Modulo contatti
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
