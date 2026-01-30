"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import Image from "next/image";
import SocialBar from "../../components/SocialBar";
import PreventivoFooter from "../../components/PreventivoFooter";
import { AnimatePresence, motion } from "framer-motion";
import { cubicBezier } from "framer-motion";
import Hero from "../../components/Hero";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";

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
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);
  const [immaginiMostrate, setImmaginiMostrate] = useState(12);
  // --- DRAG TO SCROLL CATEGORIE ---
  const categorieRef = React.useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const dragState = React.useRef({
    startX: 0,
    scrollLeft: 0,
    hasDragged: false,
  });
  // Migliorata: click e drag non si bloccano a vicenda
  function handleDragStart(e: React.MouseEvent<HTMLDivElement>) {
    setDragging(true);
    dragState.current.startX =
      e.pageX - (categorieRef.current?.getBoundingClientRect().left || 0);
    dragState.current.scrollLeft = categorieRef.current?.scrollLeft || 0;
    dragState.current.hasDragged = false;
  }
  function handleDragMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!dragging) return;
    const x =
      e.pageX - (categorieRef.current?.getBoundingClientRect().left || 0);
    const walk = x - dragState.current.startX;
    if (Math.abs(walk) > 5) dragState.current.hasDragged = true;
    if (categorieRef.current) {
      categorieRef.current.scrollLeft = dragState.current.scrollLeft - walk;
    }
  }
  function handleDragEnd() {
    setDragging(false);
  }

  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, "portfolio"));
      setItems(
        querySnapshot.docs
          .map((doc) => {
            const data = doc.data() as {
              titolo: string;
              immagine: string;
              categoria?: string;
              descrizione?: string;
              visibile?: boolean;
            };
            return {
              id: doc.id,
              titolo: data.titolo,
              immagine: data.immagine,
              categoria: data.categoria?.trim() || "",
              descrizione: data.descrizione || "",
              visibile: data.visibile !== false,
            };
          })
          .filter((item) => item.visibile),
      );
    };
    fetchItems();
  }, []);

  // Calcolo le categorie uniche presenti negli items
  const categorieUI = React.useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.categoria && item.categoria.trim() !== "")
        set.add(item.categoria.trim());
    });
    return ["Tutti", ...Array.from(set)];
  }, [items]);
  const lavoriFiltrati =
    categoriaFiltro === "Tutti"
      ? items
      : items.filter((i) => i.categoria === categoriaFiltro);
  const cardHeights = ["h-64", "h-80", "h-72", "h-96"];
  const activeItem =
    zoomIndex !== null && lavoriFiltrati[zoomIndex]
      ? lavoriFiltrati[zoomIndex]
      : null;

  const openZoom = (idx: number) => {
    setZoomIndex(idx);
  };

  const closeZoom = () => {
    setZoomIndex(null);
  };

  const nextZoom = React.useCallback(() => {
    setZoomIndex((current) => {
      if (current === null) return current;
      if (current >= lavoriFiltrati.length - 1) return current;
      return current + 1;
    });
  }, [lavoriFiltrati.length]);

  const prevZoom = React.useCallback(() => {
    setZoomIndex((current) => {
      if (current === null) return current;
      if (current <= 0) return current;
      return current - 1;
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (zoomIndex === null) return;
      if (event.key === "Escape") {
        closeZoom();
      }
      if (event.key === "ArrowRight") {
        nextZoom();
      }
      if (event.key === "ArrowLeft") {
        prevZoom();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zoomIndex, lavoriFiltrati.length, nextZoom, prevZoom]);

  // Reset paginazione quando cambia filtro
  useEffect(() => {
    setImmaginiMostrate(12);
    setZoomIndex(null);
  }, [categoriaFiltro]);

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
        <div className="w-full">
          <div
            className="flex flex-row flex-nowrap snap-x snap-mandatory gap-2 w-full pb-2 scroll-smooth select-none px-4"
            style={{
              cursor: dragging ? "grabbing" : "grab",
              userSelect: "none",
              overflowX: "auto",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
            ref={categorieRef}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            // Nasconde la scrollbar
            onScroll={() => {
              if (categorieRef.current) {
                categorieRef.current.style.scrollbarWidth = "none";
              }
            }}
          >
            {categorieUI.map((cat) => {
              const isActive = categoriaFiltro === cat;
              return (
                <button
                  key={cat}
                  onClick={(e) => {
                    // Se non c'è stato vero drag, consenti il click
                    if (!dragState.current.hasDragged) {
                      setCategoriaFiltro(cat);
                    }
                  }}
                  className={`snap-center min-w-[140px] px-5 py-2 rounded-full text-sm font-semibold tracking-[0.2em] transition-all duration-300 border flex-shrink-0 ${
                    isActive
                      ? "bg-[#317614] text-white border-[#317614] shadow-lg shadow-[#317614]/30"
                      : "bg-white text-[#317614] border-[#e5e7eb]"
                  }`}
                >
                  <span className="inline-flex items-center gap-2 transition-transform duration-300 hover:scale-[1.02]">
                    {cat}
                  </span>
                </button>
              );
            })}
          </div>
          {/* Dots indicator mobile */}
          <div className="flex justify-center gap-2 mt-2 sm:hidden w-full">
            {categorieUI.map((cat) => (
              <span
                key={cat}
                className={`block w-2 h-2 rounded-full transition-all duration-300 ${
                  categoriaFiltro === cat
                    ? "bg-[#317614]"
                    : "bg-[#cbd5e1] opacity-60"
                }`}
              />
            ))}
          </div>
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
              <div className="relative w-[90vw] h-[90vh] max-w-[90vw] max-h-[90vh] flex items-center justify-center">
                <Image
                  src={activeItem.immagine || "/placeholder.jpg"}
                  alt={activeItem.titolo}
                  fill
                  sizes="90vw"
                  className="object-contain"
                  priority
                />
                <span className="absolute top-4 right-16 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white/90 text-xs font-semibold uppercase tracking-wide">
                  {categoriaFiltro === "Tutti"
                    ? activeItem.categoria || "Progetto"
                    : categoriaFiltro}
                </span>
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
