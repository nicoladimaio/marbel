"use client";
import Image from "next/image";
import SocialBar from "./components/SocialBar";
import { useEffect, useState } from "react";
import {
  useScroll,
  useTransform,
  motion,
  AnimatePresence,
} from "framer-motion";
import ServiceCarousel from "./components/ServiceCarousel";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function Home() {
  const [showContent, setShowContent] = useState(false);
  const [tabIndex, setTab] = useState(0);
  const [portfolio, setPortfolio] = useState<
    { id: string; titolo: string; immagine?: string }[]
  >([]);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    // Carica portfolio
    const fetchPortfolio = async () => {
      const querySnapshot = await getDocs(collection(db, "portfolio"));
      setPortfolio(
        querySnapshot.docs.map((doc) => {
          const data = doc.data() as { titolo: string; immagine?: string };
          return { id: doc.id, titolo: data.titolo, immagine: data.immagine };
        })
      );
    };
    fetchPortfolio();
    return () => clearTimeout(timer);
  }, []);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 700], [0, -60]);

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
                  style={
                    {
                      // translateY leggera verrà collegata alla scroll più sotto
                    }
                  }
                  // animated y from scroll via useScroll/useTransform (see below)
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
                      "linear-gradient(180deg, rgba(26,42,78,0.6) 0%, rgba(26,42,78,0.12) 30%, rgba(255,255,255,0) 70%)",
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
                    initial={{ opacity: 0, y: 26 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.9,
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.6 }}
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
            {/* SEZIONE TRE SCHEDE STILE EDILGC.IT */}
            {/* SEZIONE TAB INTERATTIVA STILE EDILGC.IT */}
            <section className="w-full flex flex-col items-center py-16 px-4 bg-white">
              <div className="max-w-4xl w-full mx-auto">
                <h2 className="text-3xl font-bold text-[#1a2a4e] mb-8 text-center">
                  Scopri MarBel
                </h2>
                <div className="flex justify-center gap-2 mb-6">
                  {["Perché sceglierci", "I nostri servizi"].map((tab, idx) => (
                    <button
                      key={tab}
                      onClick={() => setTab(idx)}
                      className={`w-80 py-3 mx-8 rounded-xl font-semibold text-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#1a2a4e] focus:ring-offset-2 focus:ring-offset-white ${
                        tabIndex === idx
                          ? "bg-[#1a2a4e] text-white scale-105"
                          : "bg-[#f5f6fa] text-[#1a2a4e] hover:bg-[#274472] hover:text-white hover:scale-105"
                      }`}
                      aria-controls={`tabpanel-${idx}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="bg-[#f5f6fa] rounded-b-2xl shadow p-6 min-h-[180px] transition-all duration-300">
                  {tabIndex === 0 && (
                    <div
                      id="tabpanel-0"
                      role="tabpanel"
                      className="animate-fade-in relative overflow-hidden rounded-2xl"
                      style={{ minHeight: 280 }}
                    >
                      <Image
                        src="/sceglierci-bg.jpg"
                        alt="Perché sceglierci background"
                        fill
                        className="object-cover absolute inset-0 z-0"
                      />
                      <div className="absolute inset-0 bg-[#1a2a4e]/85 z-10" />
                      <div className="relative z-20 p-10 flex flex-col items-center justify-center text-center gap-8">
                        <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 drop-shadow">
                          Perché sceglierci
                        </h3>
                        <div className="flex flex-col gap-6 max-w-2xl mx-auto">
                          <div>
                            <h4 className="text-xl font-bold text-white mb-1">
                              Esperienza e professionalità
                            </h4>
                            <p className="text-white text-base sm:text-lg font-medium drop-shadow">
                              Da oltre vent’anni realizziamo progetti edili con
                              passione e competenza, garantendo risultati di
                              qualità e attenzione ai dettagli.
                            </p>
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-white mb-1">
                              Soluzioni su misura
                            </h4>
                            <p className="text-white text-base sm:text-lg font-medium drop-shadow">
                              Offriamo servizi chiavi in mano e personalizzati,
                              seguendo il cliente in ogni fase: dalla consulenza
                              alla consegna.
                            </p>
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-white mb-1">
                              Affidabilità e trasparenza
                            </h4>
                            <p className="text-white text-base sm:text-lg font-medium drop-shadow">
                              Rispettiamo tempi e budget, utilizziamo materiali
                              e tecnologie all’avanguardia e garantiamo
                              assistenza dedicata.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {tabIndex === 1 && (
                    <div
                      id="tabpanel-1"
                      role="tabpanel"
                      className="animate-fade-in relative overflow-hidden rounded-2xl flex flex-col items-center justify-center"
                      style={{ minHeight: 280 }}
                    >
                      <h3 className="text-3xl sm:text-4xl font-extrabold text-[#1a2a4e] mb-6">
                        I nostri servizi
                      </h3>
                      <ServiceCarousel />
                    </div>
                  )}
                  {tabIndex === 2 && (
                    <div
                      id="tabpanel-2"
                      role="tabpanel"
                      className="animate-fade-in"
                    >
                      <h3 className="text-xl font-bold text-[#1a2a4e] mb-2">
                        Progetti realizzati
                      </h3>
                      <ul className="text-[#3a4a5a] text-base list-disc list-inside text-left">
                        <li>Appartamenti e ville</li>
                        <li>Locali commerciali</li>
                        <li>Recupero edifici storici</li>
                        <li>
                          <a
                            href="/portfolio"
                            className="text-[#1a2a4e] underline hover:text-[#274472]"
                          >
                            Guarda il portfolio
                          </a>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </section>
            {/* SERVIZI */}
            {/* VANTAGGI */}
            {/* CTA barra orizzontale sticky con effetto parallax */}

            {/* PORTFOLIO IN EVIDENZA */}
            <section className="w-full flex flex-col items-center py-16 px-4 bg-[#F7F7F7]">
              <div className="max-w-5xl w-full mx-auto">
                <h2 className="text-3xl font-bold text-[#1a2a4e] mb-8 text-center">
                  Portfolio in evidenza
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  {portfolio.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl shadow p-6 flex flex-col items-center"
                    >
                      <Image
                        src={item.immagine || "/placeholder.jpg"}
                        alt={item.titolo}
                        width={200}
                        height={120}
                        className="rounded object-cover mb-2"
                      />
                      <strong className="mb-2 text-[#1a2a4e]">
                        {item.titolo}
                      </strong>
                      <span className="text-[#3a4a5a] text-center">
                        Descrizione lavoro...
                      </span>
                    </div>
                  ))}
                </div>
                <div className="w-full flex justify-center mt-6">
                  <a
                    href="/portfolio"
                    className="px-6 py-3 rounded-lg bg-[#1a2a4e] text-white font-semibold shadow hover:bg-[#274472] transition-all duration-200 text-base"
                  >
                    Guarda tutti i progetti
                  </a>
                </div>
              </div>
            </section>
            {/* TESTIMONIANZE */}
            <section className="w-full flex flex-col items-center py-16 px-4 bg-white">
              <div className="max-w-3xl w-full mx-auto text-center">
                <h2 className="text-3xl font-bold text-[#1a2a4e] mb-8">
                  Cosa dicono i nostri clienti
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="bg-blue-50 rounded-2xl shadow p-6">
                    <span className="text-[#3a4a5a] italic">
                      “Lavoro perfetto, tempi rispettati e grande
                      professionalità!”
                    </span>
                    <div className="mt-4 text-[#1a2a4e] font-bold">
                      Cliente 1
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-2xl shadow p-6">
                    <span className="text-[#3a4a5a] italic">
                      “Consiglio MarBel a chi cerca serietà e qualità.”
                    </span>
                    <div className="mt-4 text-[#1a2a4e] font-bold">
                      Cliente 2
                    </div>
                  </div>
                </div>
              </div>
            </section>
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
