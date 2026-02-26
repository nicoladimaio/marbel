"use client";
import React, { useState, useEffect } from "react";
import { db } from "../../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import Image from "next/image";
import SocialBar from "../../components/SocialBar";
import PreventivoFooter from "../../components/PreventivoFooter";
import { AnimatePresence, motion } from "framer-motion";
import { cubicBezier } from "framer-motion";
import Hero from "../../components/Hero";
import { FiX, FiChevronLeft, FiChevronRight, FiMapPin } from "react-icons/fi";

type PortfolioItem = {
  id: string;
  titolo: string;
  immagine: string;
  macro: string;
  categoria: string;
  visibile?: boolean;
  descrizione?: string;
  luogo?: string;
};

// --- DATI DINAMICI FIREBASE ---
const fetchMacros = async () => {
  const snap = await getDocs(collection(db, "macrocategorie"));
  return snap.docs.map((doc) => doc.data().nome);
};
const fetchCategories = async () => {
  const snap = await getDocs(collection(db, "categorie"));
  return snap.docs.map((doc) => ({
    nome: doc.data().nome,
    macro: doc.data().macro,
  }));
};
const fetchPortfolio = async () => {
  const snap = await getDocs(collection(db, "portfolio"));
  return snap.docs.map((doc) => {
    const data = doc.data() as {
      titolo?: string;
      immagine?: string;
      macro?: string;
      categoria?: string;
      visibile?: boolean;
      descrizione?: string;
      luogo?: string;
    };

    return {
      id: doc.id,
      titolo: data.titolo || "",
      immagine: data.immagine || "",
      macro: data.macro || "",
      categoria: data.categoria || "",
      visibile: data.visibile !== false,
      descrizione: data.descrizione || "",
      luogo: data.luogo || "",
    };
  });
};

export default function Portfolio() {
  const [macros, setMacros] = useState<string[]>([]);
  const [categories, setCategories] = useState<
    { nome: string; macro: string }[]
  >([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [macroSelected, setMacroSelected] = useState<string>("");
  const [subSelected, setSubSelected] = useState<string | null>(null);
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);
  const [immaginiMostrate, setImmaginiMostrate] = useState(12);

  useEffect(() => {
    fetchMacros().then((macros) => {
      setMacros(macros);
    });
    fetchCategories().then(setCategories);
    fetchPortfolio().then(setPortfolio);
  }, []);

  const portfolioConImmagini = portfolio.filter(
    (item) => item.visibile !== false && !!item.immagine?.trim(),
  );

  const macrosVisibili = macros.filter((macro) =>
    portfolioConImmagini.some((item) => item.macro === macro),
  );
  const macroSelectedEffettiva = macrosVisibili.includes(macroSelected)
    ? macroSelected
    : macrosVisibili[0] || "";

  // Sottocategorie dinamiche
  const subcategories = Array.from(
    new Set(
      categories
        .filter((c) => c.macro === macroSelectedEffettiva)
        .map((c) => c.nome)
        .filter((cat) =>
          portfolioConImmagini.some(
            (item) =>
              item.macro === macroSelectedEffettiva && item.categoria === cat,
          ),
        ),
    ),
  );
  const subSelectedEffettiva =
    subSelected && subcategories.includes(subSelected) ? subSelected : null;

  // Filtro lavori per macro e sotto
  const lavoriFiltrati = portfolio.filter(
    (item) =>
      item.visibile !== false &&
      !!item.immagine?.trim() &&
      item.macro === macroSelectedEffettiva &&
      (!subSelectedEffettiva || item.categoria === subSelectedEffettiva),
  );
  const activeItem =
    zoomIndex !== null && lavoriFiltrati[zoomIndex]
      ? lavoriFiltrati[zoomIndex]
      : null;

  const openZoom = (idx: number) => setZoomIndex(idx);
  const closeZoom = () => setZoomIndex(null);
  const nextZoom = () =>
    setZoomIndex((c) =>
      c !== null && c < lavoriFiltrati.length - 1 ? c + 1 : c,
    );
  const prevZoom = () => setZoomIndex((c) => (c !== null && c > 0 ? c - 1 : c));

  return (
    <main className="min-h-screen bg-[#f5f6fa] text-[#317614]">
      <SocialBar />

      <Hero
        image="/hero-portfolio-new.jpg"
        title="Portfolio lavori"
        subtitle="Alcuni dei nostri lavori recenti"
        height="min-h-[40vh]"
        darkness={35}
        centerImage={true}
      />

      {/* MACRO-CATEGORIE */}
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
        className="pt-8 pb-4 px-6 bg-[#f5f6fa]"
      >
        <div className="w-full flex flex-wrap gap-3 justify-center">
          {macrosVisibili.map((macro) => (
            <button
              key={macro}
              onClick={() => {
                setMacroSelected(macro);
                setSubSelected(null);
                setImmaginiMostrate(12);
                setZoomIndex(null);
              }}
              className={`px-6 py-2 rounded-full text-sm font-semibold tracking-[0.12em] border transition-all duration-300 ${
                macroSelectedEffettiva === macro
                  ? "bg-[#256029] text-white border-[#256029] shadow-lg shadow-[#256029]/30"
                  : "bg-white text-[#317614] border-[#e5e7eb]"
              }`}
            >
              {macro}
            </button>
          ))}
          {macrosVisibili.length === 0 && (
            <div className="text-sm text-[#64748b]">
              Nessuna categoria disponibile al momento.
            </div>
          )}
        </div>
      </motion.section>

      {/* SOTTOCATEGORIE */}
      <motion.section
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, ease: cubicBezier(0.22, 1, 0.36, 1) },
          },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="pt-4 pb-8 px-6 bg-[#f5f6fa]"
      >
        <div className="w-full flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => {
              setSubSelected(null);
              setImmaginiMostrate(12);
              setZoomIndex(null);
            }}
            className={`px-4 py-1 rounded-full text-xs font-semibold border transition-all duration-200 ${
              subSelectedEffettiva === null
                ? "bg-[#317614] text-white border-[#317614]"
                : "bg-white text-[#317614] border-[#e5e7eb]"
            }`}
          >
            Tutte
          </button>
          {subcategories.map((sub) => (
            <button
              key={sub}
              onClick={() => {
                setSubSelected(sub);
                setImmaginiMostrate(12);
                setZoomIndex(null);
              }}
              className={`px-4 py-1 rounded-full text-xs font-semibold border transition-all duration-200 ${
                subSelectedEffettiva === sub
                  ? "bg-[#317614] text-white border-[#317614]"
                  : "bg-white text-[#317614] border-[#e5e7eb]"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </motion.section>

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
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {lavoriFiltrati.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#cbd5f5] bg-[#f5f6fa] p-10 text-center text-[#94a3b8]">
                Nessun progetto disponibile per questa categoria al momento.
              </div>
            ) : (
              lavoriFiltrati
                .slice(0, immaginiMostrate)
                .map((project, index) => (
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
                    onClick={() => openZoom(index)}
                    className="relative overflow-hidden rounded-3xl shadow-xl cursor-pointer transition-transform duration-500 bg-white"
                  >
                    <div className="relative w-full aspect-[4/5] overflow-hidden">
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
          {lavoriFiltrati.length > immaginiMostrate && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setImmaginiMostrate((n) => n + 12)}
                className="px-6 py-3 rounded-full bg-[#317614] text-white font-semibold shadow-lg hover:bg-[#223867] transition-all duration-250"
              >
                Carica altri progetti
              </button>
            </div>
          )}
        </div>
      </motion.section>

      <AnimatePresence>
        {activeItem && zoomIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeZoom}
          >
            <button
              className="absolute top-4 right-4 rounded-full bg-white/10 border border-white/15 p-3 text-white hover:bg-white/20 transition-colors z-50"
              onClick={(e) => {
                e.stopPropagation();
                closeZoom();
              }}
              aria-label="Chiudi"
            >
              <FiX className="text-2xl" />
            </button>

            <button
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 rounded-full bg-white/10 border border-white/15 p-3 text-white shadow-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 z-50"
              onClick={(e) => {
                e.stopPropagation();
                prevZoom();
              }}
              disabled={zoomIndex === 0}
              aria-label="Immagine precedente"
            >
              <FiChevronLeft className="text-2xl" />
            </button>

            <button
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 rounded-full bg-white/10 border border-white/15 p-3 text-white shadow-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 z-50"
              onClick={(e) => {
                e.stopPropagation();
                nextZoom();
              }}
              disabled={zoomIndex === lavoriFiltrati.length - 1}
              aria-label="Immagine successiva"
            >
              <FiChevronRight className="text-2xl" />
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex items-center justify-center w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-[92vw] max-w-[1220px] flex flex-col items-center gap-3">
                <div className="relative w-full h-[72vh] max-h-[72vh] lg:h-[78vh] lg:max-h-[78vh] rounded-2xl overflow-hidden bg-black/35">
                  <Image
                    src={activeItem.immagine || "/placeholder.jpg"}
                    alt={activeItem.titolo}
                    fill
                    sizes="90vw"
                    className="object-contain"
                    priority
                  />
                </div>

                <div className="w-full rounded-2xl bg-black/55 backdrop-blur-md border border-white/15 p-3 sm:p-4 text-white shadow-lg">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <h3 className="text-base sm:text-xl font-bold leading-tight tracking-tight">
                      {activeItem.titolo || "Progetto"}
                    </h3>
                    <span className="px-3 py-1 rounded-full bg-black/40 text-white/90 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.12em]">
                      {activeItem.categoria || "Progetto"}
                    </span>
                  </div>

                  {activeItem.descrizione && (
                    <p className="mt-2 text-xs sm:text-sm text-white/90 leading-relaxed max-w-4xl">
                      {activeItem.descrizione}
                    </p>
                  )}

                  {activeItem.luogo && (
                    <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-200/35 bg-emerald-300/10 px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-emerald-100">
                      <FiMapPin className="text-sm" />
                      <span className="truncate max-w-[60vw] sm:max-w-none">
                        {activeItem.luogo}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <PreventivoFooter
        eyebrow="Vuoi un risultato come questi?"
        title="Scopri cosa possiamo fare per te"
        subtitle="Dai piccoli interventi alle ristrutturazioni totali: lasciati ispirare dai nostri risultati reali."
        buttonText="Richiedi la tua offerta"
      />
    </main>
  );
}
