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

// SEMPLIFICAZIONE PortfolioImage: solo fade-in on scroll, hover con cursor-pointer, nessun overlay/icona, nessun zoom
function PortfolioImage({
  src,
  alt,
  onClick,
}: {
  src: string;
  alt: string;
  onClick?: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    if (node) observer.observe(node);
    return () => {
      if (node) observer.unobserve(node);
    };
  }, []);

  return (
    <div
      ref={ref}
      onClick={onClick}
      style={{ minHeight: 240 }}
      className={`relative w-full overflow-hidden rounded-2xl cursor-pointer group transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-lg ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        className="object-cover w-full h-full rounded-2xl transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-0 pointer-events-none rounded-2xl ring-2 ring-transparent group-hover:ring-[#1a2a4e]/80 transition-all duration-300" />
    </div>
  );
}

export default function Portfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState("Tutti");
  const [gridVisible, setGridVisible] = useState(false);
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

  useEffect(() => {
    const timeout = setTimeout(() => setGridVisible(true), 200);
    return () => clearTimeout(timeout);
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
            src="/gallery2.jpg"
            alt="Portfolio MarBel"
            fill
            priority
            className="object-cover object-center"
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
        <div className="max-w-6xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {lavoriFiltrati.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-[#cbd5f5] bg-[#f5f6fa] p-10 text-center text-[#94a3b8]">
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
                  delay: index * 0.08,
                  ease: cubicBezier(0.22, 1, 0.36, 1),
                }}
                onClick={() => setSelectedProject(project)}
                className="rounded-2xl shadow-lg overflow-hidden bg-white border border-[#e5e7eb] transition-transform duration-500 hover:-translate-y-2 hover:rotate-[1deg] cursor-pointer"
              >
                <div className="relative h-60 overflow-hidden">
                  <Image
                    src={project.immagine || "/placeholder.jpg"}
                    alt={project.titolo}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="p-6 space-y-3">
                  <h4 className="text-xl font-semibold uppercase tracking-[0.2em]">
                    {project.titolo}
                  </h4>
                  <p className="text-[#475569] text-sm leading-relaxed">
                    {project.descrizione || "Progetto sartoriale MarBel."}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.section>

      {/* FILTRI E DESCRIZIONE */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <p className="text-sm uppercase tracking-[0.4em] text-[#94a3b8]">
              Categorie
            </p>
            <h2 className="text-3xl font-extrabold uppercase tracking-wide">
              FILTRA I PROGETTI
            </h2>
            <p className="text-lg text-[#475569] max-w-3xl">
              Naviga tra cucine, bagni, riqualificazioni ed esterni: ogni
              progetto racconta metodi, materiali e dettagli sartoriali.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                className={`px-6 py-3 rounded-full text-sm font-semibold tracking-[0.2em] transition-all ${
                  categoriaFiltro === "Tutti"
                    ? "bg-[#1a2a4e] text-white shadow-lg shadow-[#1a2a4e]/30"
                    : "border border-[#e5e7eb] bg-white text-[#1a2a4e] hover:bg-[#f5f6fa]"
                }`}
                onClick={() => setCategoriaFiltro("Tutti")}
              >
                TUTTI
              </button>
              {categorie.map((cat) => (
                <button
                  key={cat}
                  className={`px-6 py-3 rounded-full text-sm font-semibold tracking-[0.2em] whitespace-nowrap transition-all ${
                    categoriaFiltro === cat
                      ? "bg-[#1a2a4e] text-white shadow-lg shadow-[#1a2a4e]/30"
                      : "border border-[#e5e7eb] bg-white text-[#1a2a4e] hover:bg-[#f5f6fa]"
                  }`}
                  onClick={() => setCategoriaFiltro(cat || "")}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div
            className={`transition-all duration-700 ${
              gridVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
              {lavoriFiltrati.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-xl text-center py-16 text-[#94a3b8]">
                  Non ci sono elementi per questa categoria
                </div>
              ) : (
                lavoriFiltrati.map((i, idx) => (
                  <PortfolioImage
                    key={i.id}
                    src={i.immagine || "/placeholder.jpg"}
                    alt={i.titolo}
                    onClick={() => openZoom(idx)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </section>
      {/* MODALE ZOOM MIGLIORATA */}
      {zoomIndex !== null && lavoriFiltrati[zoomIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          {/* X in alto a destra */}
          <button
            className="fixed top-6 right-8 bg-black bg-opacity-80 rounded-full p-3 text-2xl font-bold text-white shadow-lg hover:bg-blue-400 hover:text-white transition-all"
            onClick={closeZoom}
            aria-label="Chiudi"
            style={{ zIndex: 60 }}
          >
            ×
          </button>
          {/* Lente di ingrandimento: zoom immagine */}
          <button
            className="fixed top-6 right-24 bg-black bg-opacity-80 rounded-full p-3 text-2xl text-white shadow-lg hover:bg-blue-400 hover:text-white transition-all flex items-center gap-2"
            onClick={() => setZoomed((prev) => !prev)}
            aria-label="Zoom"
            style={{ zIndex: 60 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <circle
                cx="11"
                cy="11"
                r="8"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="21"
                y1="21"
                x2="16.65"
                y2="16.65"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </button>
          {/* Frecce ai margini */}
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-80 rounded-r-full p-4 text-3xl font-bold text-white shadow-lg hover:bg-blue-400 hover:text-white transition-all"
            onClick={prevZoom}
            aria-label="Precedente"
            style={{ zIndex: 55 }}
          >
            ‹
          </button>
          {/* IMMAGINE PERFETTAMENTE CENTRATA E ZOOM */}
          <div className="flex items-center justify-center w-full h-full">
            <Image
              src={lavoriFiltrati[zoomIndex].immagine || "/placeholder.jpg"}
              alt={lavoriFiltrati[zoomIndex].titolo}
              fill
              sizes="100vw"
              className={`object-contain transition-all duration-500 mx-auto ${
                zoomed ? "scale-125" : "scale-100"
              } max-w-2xl max-h-[80vh]`}
              priority={true}
            />
          </div>
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-80 rounded-l-full p-4 text-3xl font-bold text-white shadow-lg hover:bg-blue-400 hover:text-white transition-all"
            onClick={nextZoom}
            aria-label="Successiva"
            style={{ zIndex: 55 }}
          >
            ›
          </button>
        </div>
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
        className="py-24 px-6 bg-white text-center"
      >
        <div className="max-w-4xl mx-auto space-y-4">
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
        </div>
      </motion.section>
      <PreventivoFooter />
    </main>
  );
}
