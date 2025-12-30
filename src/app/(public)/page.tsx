"use client";
import Image from "next/image";
import SocialBar from "../components/SocialBar";
import { useEffect, useState } from "react";
import {
  useScroll,
  useTransform,
  motion,
  AnimatePresence,
  cubicBezier,
} from "framer-motion";
import ServiceCarousel from "../components/ServiceCarousel";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { FaHardHat, FaRedo, FaTools } from "react-icons/fa";
import PreventivoFooter from "../components/PreventivoFooter";
import { FiCheck } from "react-icons/fi";
import analisiImg from "@/../public/analisi-home.webp";
import realizzazioneImg from "@/../public/realizzazione-home.webp";
import consegnaImg from "@/../public/consegna-home.webp";

export default function Home() {
  const cardReveal = (delay = 0) => ({
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.85, delay, ease: cubicBezier(0.16, 1, 0.3, 1) },
  });
  const [showContent, setShowContent] = useState(false);
  const [valuesTab, setValuesTab] = useState<"metodo" | "valori">("metodo");
  const [methodTab, setMethodTab] = useState<
    "analisi" | "realizzazione" | "consegna"
  >("analisi");
  const [offers, setOffers] = useState<
    { id: string; titolo: string; descrizione: string; immagine?: string }[]
  >([]);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 50);
    const fetchOffers = async () => {
      const querySnapshot = await getDocs(collection(db, "offerte"));
      setOffers(
        querySnapshot.docs
          .map((doc) => {
            const data = doc.data() as {
              titolo: string;
              descrizione: string;
              immagine?: string;
              visibile?: boolean;
            };
            return {
              id: doc.id,
              titolo: data.titolo,
              descrizione: data.descrizione,
              immagine: data.immagine,
              visibile: data.visibile,
            };
          })
          .filter((offer) => offer.visibile !== false)
      );
    };
    fetchOffers();
    return () => clearTimeout(timer);
  }, []);

  const { scrollY } = useScroll();
  // Disattiva parallax su mobile
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const heroY = useTransform(scrollY, [0, 200], isMobile ? [0, 0] : [0, -40]);

  const scrollReveal = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: cubicBezier(0.16, 1, 0.3, 1) },
    },
  };
  const cardParallax = useTransform(scrollY, [0, 1200], [6, -3]);

  const methodSteps = [
    {
      key: "analisi" as const,
      title: "Analisi",
      description:
        "Direzione lavori certificata, squadre coordinate e aggiornamenti su dashboard condivisa per partire con una visione chiara.",
      image: analisiImg,
      alt: "Analisi",
      priority: true,
      direction: "left" as const,
    },
    {
      key: "realizzazione" as const,
      title: "Realizzazione",
      description:
        "Materiali certificati, partner selezionati e mockup prima di andare in produzione assicurano cantiere controllato.",
      image: realizzazioneImg,
      alt: "Realizzazione",
      direction: "right" as const,
    },
    {
      key: "consegna" as const,
      title: "Consegna",
      description:
        "Preventivi chiari, milestone approvate dal cliente e garanzia scritta sui lavori eseguiti per una chiusura trasparente.",
      image: consegnaImg,
      alt: "Consegna",
      direction: "left" as const,
    },
  ];
  const valueCards = [
    {
      icon: FaHardHat,
      title: "Professionalità",
      text: "Direzione lavori certificata, squadre coordinate e aggiornamenti su dashboard condivisa.",
    },
    {
      icon: FaTools,
      title: "Qualità",
      text: "Materiali certificati, partner selezionati e mockup prima di andare in produzione.",
    },
    {
      icon: FaRedo,
      title: "Affidabilità",
      text: "Preventivi chiari, milestone approvate dal cliente e garanzia scritta sui lavori eseguiti.",
    },
  ];
  const activeMethodStep =
    methodSteps.find((step) => step.key === methodTab) ?? methodSteps[0];
  const activeMethodIndex = methodSteps.findIndex(
    (step) => step.key === activeMethodStep.key
  );

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
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      {/* Social vertical bar */}
      <SocialBar />
      <AnimatePresence>
        {showContent && (
          <>
            {/* HERO SECTION */}
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full p-0 m-0"
            >
              <div className="relative w-full flex items-center justify-center overflow-hidden pt-hero-landscape md:h-screen md:min-h-screen">
                {/* Background image with subtle parallax */}
                <motion.div
                  className="absolute inset-0 z-0"
                  style={{ y: heroY }}
                  id="hero-bg-parallax"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.div className="relative w-full h-full overflow-hidden">
                    <Image
                      src="/sfondo.jpg"
                      alt="Sfondo hero"
                      fill
                      priority
                      className="object-cover object-center will-change-transform"
                    />
                  </motion.div>
                </motion.div>

                {/* Overlay gradient (sottile e professionale) */}
                <div
                  className="absolute inset-0 z-5 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.18) 45%, rgba(0,0,0,0.05) 80%)",
                    transition: "opacity 0.8s ease",
                  }}
                  aria-hidden
                />

                {/* Content stack: logo, title, subtitle, cta */}
                <div className="relative z-10 flex flex-col items-center justify-center gap-0 sm:gap-4 text-center px-4 ">
                  {/* Logo (la tua immagine rimane) */}
                  <div className="mt-10 sm:mt-0 hero-logo-landscape">
                    <Image
                      src="/logo.png"
                      alt="Logo"
                      width={240}
                      height={80}
                      priority
                      className="mb-0 drop-shadow-md hero-logo-landscape"
                    />
                  </div>

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
                    className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight mb-2"
                    style={{
                      textShadow:
                        "0 2px 8px rgba(0, 0, 0, 0.7), 0 0px 2px #000000ff, 1px 1px 0 #000000ff, -1px -1px 0 #000000ff",
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
                      className="px-10 py-3 rounded-xl bg-[#1a2a4e] text-white font-semibold shadow-lg shadow-black/30 hover:bg-[#223867] transition-all duration-250 text-lg"
                    >
                      Calcola ora
                    </motion.a>

                    <motion.a
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      href="/contatti"
                      className="px-8 py-3 rounded-xl text-white font-semibold border border-white/20 bg-white/5 backdrop-blur-sm shadow-lg shadow-black/30 hover:bg-white/15 transition-all duration-250 text-lg"
                    >
                      Contattaci
                    </motion.a>
                  </motion.div>
                </div>

                <motion.div
                  className="absolute bottom-10 inset-x-0 flex justify-center z-10"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 1.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  aria-hidden
                ></motion.div>
              </div>
            </motion.section>

            {/* METODO / VALORI */}
            <section className="py-24 bg-white">
              <div className="max-w-6xl mx-auto px-6 space-y-12">
                <div className="flex flex-col items-center space-y-8">
                  <div className="flex gap-8 border-b border-[#e2e8f0]">
                    {[
                      { key: "metodo", label: "METODO" },
                      { key: "valori", label: "VALORI" },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() =>
                          setValuesTab(tab.key as "metodo" | "valori")
                        }
                        className={`px-10 py-4 text-sm font-semibold tracking-[0.4em] ${
                          valuesTab === tab.key
                            ? "text-[#1a2a4e]"
                            : "text-[#94a3b8]"
                        }`}
                      >
                        {tab.label}
                        <span
                          className={`block h-[2px] mt-3 transition-all duration-300 ${
                            valuesTab === tab.key
                              ? "bg-[#1a2a4e] w-full"
                              : "bg-transparent w-0"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {valuesTab === "metodo" && (
                  <div className="space-y-10">
                    <div className="flex flex-wrap items-center justify-center gap-4 relative">
                      <div
                        id="methodTabsScroll"
                        className="flex flex-row overflow-x-auto flex-nowrap snap-x snap-mandatory gap-2 sm:justify-center sm:gap-8 sm:overflow-visible w-full pb-2 scroll-smooth"
                      >
                        {methodSteps.map((step) => (
                          <button
                            key={step.key}
                            type="button"
                            onClick={() => setMethodTab(step.key)}
                            className={`snap-center w-[90vw] max-w-xs sm:w-auto px-8 py-3 rounded-2xl border text-sm font-semibold tracking-[0.35em] uppercase transition-all flex-shrink-0 ${
                              methodTab === step.key
                                ? "border-[#1a2a4e] text-[#1a2a4e] bg-white shadow-lg shadow-[#1a2a4e]/20"
                                : "border-[#d8dee7] text-[#94a3b8] hover:text-[#1a2a4e]"
                            }`}
                          >
                            {step.title}
                          </button>
                        ))}
                      </div>
                      {/* Dots indicator mobile */}
                      <div className="flex justify-center gap-2 mt-2 sm:hidden w-full">
                        {methodSteps.map((step, i) => (
                          <span
                            key={step.key}
                            className={`block w-2 h-2 rounded-full transition-all duration-300 ${
                              methodTab === step.key
                                ? "bg-[#1a2a4e]"
                                : "bg-[#cbd5e1] opacity-60"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <motion.div
                      key={activeMethodStep.key}
                      initial={{
                        opacity: 0,
                        x: activeMethodStep.direction === "left" ? -40 : 40,
                      }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.75,
                        ease: cubicBezier(0.22, 1, 0.36, 1),
                      }}
                      className="flex flex-col lg:flex-row items-center gap-10 bg-[#f8fafc] rounded-2xl p-8 shadow-[0_25px_60px_-35px_rgba(15,23,42,0.35)]"
                    >
                      <div className="relative w-full lg:w-1/2 h-40 sm:h-56 lg:h-72 rounded-2xl overflow-hidden transition-all duration-300">
                        <Image
                          src={activeMethodStep.image}
                          alt={activeMethodStep.alt}
                          fill
                          placeholder="blur"
                          priority={Boolean(activeMethodStep.priority)}
                          loading={
                            activeMethodStep.priority ? "eager" : undefined
                          }
                          sizes="(min-width:1024px) 40vw, 100vw"
                          className="object-cover rounded-2xl"
                        />
                      </div>
                      <div className="w-full lg:w-1/2 space-y-4">
                        <p className="text-sm uppercase tracking-[0.4em] text-[#94a3b8]">
                          Step {String(activeMethodIndex + 1).padStart(2, "0")}
                        </p>
                        <h3 className="text-3xl font-bold text-[#1a2a4e]">
                          {activeMethodStep.title}
                        </h3>
                        <p className="text-lg text-[#475569] leading-relaxed">
                          {activeMethodStep.description}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                )}

                {valuesTab === "valori" && (
                  <div className="grid md:grid-cols-3 gap-6">
                    {valueCards.map((card, index) => {
                      const Icon = card.icon;
                      return (
                        <motion.div
                          key={card.title}
                          {...cardReveal(index * 0.12)}
                          className="rounded-2xl border border-[#e2e8f0] bg-white shadow-lg p-8 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                          style={{
                            y: cardParallax,
                            transformPerspective: 1200,
                          }}
                          whileHover={{
                            rotateX: 3,
                            rotateY: -3,
                            y: -10,
                            boxShadow: "0 30px 70px -40px rgba(26,42,78,0.45)",
                            transition: {
                              duration: 0.35,
                              ease: cubicBezier(0.22, 1, 0.36, 1),
                            },
                          }}
                        >
                          <Icon className="text-4xl text-[#1A2A4E] mb-4" />
                          <h3 className="text-xl font-semibold uppercase tracking-wide mb-3 text-[#1A2A4E]">
                            {card.title}
                          </h3>
                          <p className="text-[#475569] leading-relaxed">
                            {card.text}
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>

            {/* SERVIZI */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={scrollReveal}
              className="py-24 bg-[#0f172a] overflow-visible"
            >
              <div
                className="max-w-7xl mx-auto px-6 space-y-12 overflow-visible"
                style={{ overflow: "visible" }}
              >
                <div className="text-center space-y-4 text-left">
                  <p className="text-sm uppercase tracking-[0.4em] text-white/60">
                    Servizi
                  </p>
                  <h2 className="text-3xl md:text-4xl font-extrabold leading-tight text-white">
                    Dalla progettazione al collaudo, ogni fase ha una squadra
                    dedicata.
                  </h2>
                  <p className="text-lg text-white/80">
                    Scopri le lavorazioni disponibili e naviga tra le proposte
                    pensate per cucine, bagni, pavimenti e impianti.
                  </p>
                  <ul className="mt-6 space-y-4">
                    {[
                      "Squadre specializzate e interventi eseguiti con precisione e rispetto delle tempistiche.",
                      "Materiali certificati, tecniche moderne e cura dei dettagli in ogni fase.",
                      "Trasparenza, comunicazione continua e lavori garantiti dalla progettazione alla consegna.",
                    ].map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-white/80"
                      >
                        <span className="w-4 h-4 flex items-center justify-center rounded-full bg-[#8de8ff] text-white flex-shrink-0">
                          <FiCheck
                            className="text-[#0f172a] stroke-[3]"
                            size={14}
                          />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
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
                <ServiceCarousel />
              </div>
            </motion.section>

            {/* OFFERTE */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={scrollReveal}
              className="py-24 bg-[#f1f5f9]"
            >
              <div className="max-w-7xl mx-auto px-6 space-y-12">
                <div className="text-center space-y-4">
                  <p className="text-sm uppercase tracking-[0.4em] text-[#7c8cab]">
                    Offerte
                  </p>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A2A4E]">
                    Offerte attive
                  </h2>
                  <p className="text-lg text-[#475569] max-w-3xl mx-auto">
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
                        whileHover={{
                          translateY: -8,
                          scale: 1.015,
                          rotate: 0.8,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 210,
                          damping: 18,
                        }}
                        className="group bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full"
                      >
                        <div className="relative h-48 w-full overflow-hidden">
                          <Image
                            src={imageSrc}
                            alt={offer.titolo}
                            fill
                            className="object-cover w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 group-hover:rotate-[1deg]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
                          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 via-black/20 to-transparent pointer-events-none" />
                        </div>
                        <div className="p-6 flex flex-col gap-3 flex-1">
                          <motion.h3
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.4 }}
                            transition={{
                              duration: 0.55,
                              delay: 0.15,
                              ease: cubicBezier(0.22, 1, 0.36, 1),
                            }}
                            className="text-xl font-bold text-[#1A2A4E]"
                          >
                            {offer.titolo}
                          </motion.h3>
                          <p className="text-[#475569] text-sm flex-1">
                            {offer.descrizione}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="flex justify-center">
                  <a
                    href="/offerte"
                    className="w-full max-w-xs sm:max-w-none px-6 sm:px-10 py-3 rounded-2xl bg-[#1a2a4e] text-white font-semibold uppercase tracking-[0.18em] shadow-xl hover:bg-[#223867] transition-all duration-300 text-center text-sm sm:text-base"
                  >
                    <span className="sm:hidden">Tutte le offerte</span>
                    <span className="hidden sm:inline">
                      Scopri tutte le offerte
                    </span>
                  </a>
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
            <PreventivoFooter
              eyebrow="Pronto a iniziare?"
              title="Trasforma la tua casa con MarBel"
              subtitle="Ti guidiamo passo dopo passo: analisi, progetto, realizzazione e consegna chiavi in mano."
              buttonText="Richiedi preventivo"
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
