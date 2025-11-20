"use client";
import React, { useEffect, useState, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import Image from "next/image";
import SocialBar from "../components/SocialBar";
import PreventivoFooter from "../components/PreventivoFooter";
import { motion, useScroll, useTransform } from "framer-motion";
import { cubicBezier } from "framer-motion";

type PortfolioItem = {
  id: string;
  titolo: string;
  immagine: string;
  categoria?: string;
  descrizione?: string;
};

export default function Portfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState("Tutti");
  const [zoomSrc, setZoomSrc] = useState<string | null>(null);
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(
    null
  );
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, "portfolio"));
      setItems(
        querySnapshot.docs.map((doc) => {
          const data = doc.data() as {
            titolo: string;
            immagine: string;
            categoria?: string;
            descrizione?: string;
          };
          return {
            id: doc.id,
            titolo: data.titolo,
            immagine: data.immagine,
            categoria: data.categoria?.trim() || "",
            descrizione: data.descrizione || "",
          };
        })
      );
    };
    fetchItems();
  }, []);

  // Estrai categorie uniche dai lavori
  const categorie = Array.from(
    new Set(
      items.map((i) => (i.categoria || "").trim()).filter((c) => c.length > 0)
    )
  );
const categorieUI = [
  "Tutti",
  ...categorie.filter((cat) => cat.toLowerCase() !== "tutti"),
];
const lavoriFiltrati =
  categoriaFiltro === "Tutti"
    ? items
    : items.filter((i) => i.categoria === categoriaFiltro);
const cardHeights = ["h-64", "h-80", "h-72", "h-96"];

  // Funzione per aprire la modale su una certa immagine
  const openZoom = (idx: number) => {
    setZoomIndex(idx);
    setFullscreen(false);
  };
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });
  const heroParallax = useTransform(heroProgress, [0, 1], [15, 0]);
  const closeZoom = () => setZoomIndex(null);
  const nextZoom = () => {
    if (zoomIndex !== null && lavoriFiltrati.length > 0) {
      setZoomIndex((zoomIndex + 1) % lavoriFiltrati.length);
    }
  };
  const prevZoom = () => {
    if (zoomIndex !== null && lavoriFiltrati.length > 0) {
      setZoomIndex(
        (zoomIndex - 1 + lavoriFiltrati.length) % lavoriFiltrati.length
      );
    }
  };
  const handleFullscreen = () => {
    setFullscreen((prev) => !prev);
    if (imageContainerRef.current) {
      if (!fullscreen) {
        imageContainerRef.current.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f6fa] text-[#1a2a4e]">
      <SocialBar />

      {/* HERO */}
      <section
        ref={heroRef}
        className="relative min-h-[40vh] flex items-center justify-center overflow-hidden"
      >
        <motion.div style={{ y: heroParallax }} className="absolute inset-0">
          <Image
            src="/portfolio-hero.jpg"
            alt="Portfolio MarBel"
            fill
            priority
            className="object-cover object-[30%_10%]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-black/25" />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: cubicBezier(0.22, 1, 0.36, 1) }}
          className="relative z-10 max-w-4xl text-center px-6 space-y-3 text-white"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-[0.35em]">
            Portfolio lavori
          </h1>
          <p className="text-white/85 text-lg sm:text-xl leading-relaxed">
            Alcuni dei nostri interventi recenti.
          </p>
        </motion.div>
      </section>

      {/* FILTRI */}
      <motion.section
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: cubicBezier(0.22, 1, 0.36, 1) },
          },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="py-16 px-6 bg-[#f5f6fa]"
      >
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-3">
          {categorieUI.map((cat) => {
            const isActive = categoriaFiltro === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategoriaFiltro(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold tracking-[0.2em] transition-all duration-300 border ${
                  isActive
                    ? "bg-[#1a2a4e] text-white border-[#1a2a4e] shadow-lg shadow-[#1a2a4e]/30"
                    : "bg-white text-[#1a2a4e] border-[#e5e7eb]"
                }`}
              >
                <span className="inline-flex items-center gap-2 transition-transform duration-300 hover:scale-[1.02]">
                  {cat}
                  {isActive && (
                    <span className="block h-[2px] w-full bg-white" />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </motion.section>

      {/* GRID PORTFOLIO */}
      <motion.section
        variants={{
          hidden: { opacity: 0, y: 24 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.9, ease: cubicBezier(0.22, 1, 0.36, 1) },
          },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="py-24 px-6 bg-white"
      >
        <div className="max-w-6xl mx-auto columns-1 sm:columns-2 lg:columns-3 [column-gap:1.5rem] [column-fill:_balance]">
          {lavoriFiltrati.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#cbd5f5] bg-[#f5f6fa] p-10 text-center text-[#94a3b8] [break-inside:avoid]">
              Nessun progetto disponibile per questa categoria al momento.
            </div>
          ) : (
            lavoriFiltrati.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.07,
                  ease: cubicBezier(0.22, 1, 0.36, 1),
                }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedProject(project)}
                className="relative mb-6 overflow-hidden rounded-3xl shadow-xl cursor-pointer transition-transform duration-500 [break-inside:avoid]"
              >
                <div
                  className={`relative w-full ${cardHeights[index % cardHeights.length]} overflow-hidden`}
                >
                  <Image
                    src={project.immagine || "/placeholder.jpg"}
                    alt={project.titolo}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-40 transition-opacity duration-500" />
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.section>

      {/* MODALE ZOOM MIGLIORATA */}
      {zoomIndex !== null && lavoriFiltrati[zoomIndex] && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={closeZoom}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-[90vw] h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-6 right-6 bg-black/70 rounded-full p-3 text-2xl font-bold text-white shadow-lg hover:bg-blue-400 transition-all"
              onClick={closeZoom}
              aria-label="Chiudi"
            >
              ×
            </button>
            <button
              className="absolute top-6 right-24 bg-black/70 rounded-full p-3 text-2xl text-white shadow-lg hover:bg-blue-400 transition-all flex items-center gap-2"
              onClick={() => setZoomed((prev) => !prev)}
              aria-label="Zoom"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <circle cx="11" cy="11" r="8" strokeWidth="2" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" />
              </svg>
            </button>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 rounded-full p-4 text-3xl font-bold text-white shadow-lg hover:bg-blue-400 transition-all"
              onClick={prevZoom}
              aria-label="Precedente"
            >
              {"<"}
            </button>
            <div className="relative w-full h-full max-w-[90vw] max-h-[90vh]">
              <Image
                src={lavoriFiltrati[zoomIndex].immagine || "/placeholder.jpg"}
                alt={lavoriFiltrati[zoomIndex].titolo}
                fill
                className={`object-contain transition-transform duration-500 ${
                  zoomed ? "scale-110" : "scale-100"
                }`}
                priority
              />
            </div>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 rounded-full p-4 text-3xl font-bold text-white shadow-lg hover:bg-blue-400 transition-all"
              onClick={nextZoom}
              aria-label="Successiva"
            >
              {">"}
            </button>
          </motion.div>
        </motion.div>
      )}
      {selectedProject && (
        <div
          className="fixed inset-0 z-[70] bg-black/60 flex items-center justify-center px-4"
          onClick={() => setSelectedProject(null)}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35, ease: cubicBezier(0.22, 1, 0.36, 1) }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden"
          >
            <button
              className="absolute top-4 right-4 text-[#1a2a4e] text-2xl font-semibold"
              onClick={() => setSelectedProject(null)}
              aria-label="Chiudi"
            >
              ×
            </button>
            <div className="relative h-72 sm:h-96">
              <Image
                src={selectedProject.immagine || "/placeholder.jpg"}
                alt={selectedProject.titolo}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
            <div className="p-8 space-y-4 text-[#475569]">
              <p className="text-sm uppercase tracking-[0.35em] text-[#94a3b8]">
                Dettagli progetto
              </p>
              <h3 className="text-2xl font-extrabold uppercase tracking-[0.3em] text-[#1a2a4e]">
                {selectedProject.titolo}
              </h3>
              <p>
                {selectedProject.descrizione || "Progetto sartoriale MarBel."}
              </p>
              <div className="text-sm space-y-1">
                <p className="font-semibold text-[#1a2a4e]">
                  Categoria: {selectedProject.categoria || "Progetto su misura"}
                </p>
                <p className="font-semibold text-[#1a2a4e]">
                  Riferimento: {selectedProject.id}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      <motion.section
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.9, ease: cubicBezier(0.22, 1, 0.36, 1) },
          },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="py-24 px-6 bg-[#f7f7f7]"
      >
        <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-2">
          {[
            {
              label: "Prima",
              text: "Ambiente datato, poca luce e spazi frammentati.",
              image: "/gallery1.jpg",
            },
            {
              label: "Dopo",
              text: "Volumi armonizzati, luce naturale e materiali sartoriali.",
              image: "/gallery2.jpg",
            },
          ].map(({ label, text, image }) => (
            <motion.div key={label} className="space-y-4">
              <div className="relative h-72 rounded-2xl overflow-hidden shadow-lg">
                <Image src={image} alt={label} fill className="object-cover" />
              </div>
              <h4 className="text-lg font-semibold uppercase tracking-[0.3em]">
                {label}
              </h4>
              <p className="text-[#475569]">{text}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        variants={{
          hidden: { opacity: 0, y: 25 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: cubicBezier(0.22, 1, 0.36, 1) },
          },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="py-24 px-6 bg-white text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: cubicBezier(0.22, 1, 0.36, 1) }}
          className="max-w-4xl mx-auto space-y-4"
        >
          <p className="text-sm uppercase tracking-[0.4em] text-[#94a3b8]">
            Vuoi un risultato come questi?
          </p>
          <h4 className="text-3xl font-semibold uppercase tracking-[0.3em] text-[#1a2a4e]">
            Scopri cosa possiamo fare per te
          </h4>
          <p className="text-lg text-[#475569]">
            Pianifichiamo insieme il tuo intervento con materiali coordinati e
            team dedicati.
          </p>
          <a
            href="/preventivo"
            className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-[#1a2a4e] text-white font-semibold shadow-lg shadow-[#1a2a4e]/30 hover:bg-[#223867] transition-colors duration-300"
          >
            Richiedi un preventivo gratuito
          </a>
        </motion.div>
      </motion.section>
      <PreventivoFooter />
    </main>
  );
}
