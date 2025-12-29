"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import Image from "next/image";
import SocialBar from "../components/SocialBar";
import PreventivoFooter from "../components/PreventivoFooter";
import { AnimatePresence, motion } from "framer-motion";
import { cubicBezier } from "framer-motion";
import Hero from "../components/Hero";

type Offerta = {
  id: string;
  titolo: string;
  descrizione: string;
  immagine: string;
  prezzo: string;
  validita: string;
};

export default function Offerte() {
  const [offerte, setOfferte] = useState<Offerta[]>([]);
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchOfferte = async () => {
      const querySnapshot = await getDocs(collection(db, "offerte"));
      setOfferte(
        querySnapshot.docs.map((doc) => {
          const data = doc.data() as {
            titolo: string;
            descrizione: string;
            immagine: string;
            prezzo: string;
            validita: string;
          };
          return {
            id: doc.id,
            titolo: data.titolo,
            descrizione: data.descrizione,
            immagine: data.immagine,
            prezzo: data.prezzo,
            validita: data.validita,
          };
        })
      );
    };
    fetchOfferte();
  }, []);

  const openZoom = (idx: number) => {
    setZoomIndex(idx);
  };

  const closeZoom = () => {
    setZoomIndex(null);
  };

  const nextZoom = () => {
    setZoomIndex((current) => {
      if (current === null) return current;
      if (current >= offerte.length - 1) return current;
      return current + 1;
    });
  };

  const prevZoom = () => {
    setZoomIndex((current) => {
      if (current === null) return current;
      if (current <= 0) return current;
      return current - 1;
    });
  };

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
  }, [zoomIndex, offerte.length]);

  return (
    <main className="min-h-screen bg-[#f5f6fa] text-[#1a2a4e]">
      <SocialBar />

      <Hero
        image="/hero-offerte.jpg"
        title="Offerte speciali"
        subtitle="Scopri le nostre promozioni attive"
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
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {offerte.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#cbd5f5] bg-[#f5f6fa] p-10 text-center text-[#94a3b8]">
                Nessuna offerta disponibile al momento.
              </div>
            ) : (
              offerte.map((offerta, index) => (
                <motion.div
                  key={offerta.id}
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
                  className="relative mb-6 overflow-hidden rounded-3xl shadow-xl cursor-pointer transition-transform duration-500"
                >
                  <div className="relative w-full h-64 overflow-hidden">
                    <Image
                      src={offerta.immagine || "/placeholder.jpg"}
                      alt={offerta.titolo}
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-40 transition-opacity duration-500" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <h3 className="text-lg font-bold text-white mb-1">
                      {offerta.titolo}
                    </h3>
                    <p className="text-sm text-white/80 mb-2">
                      {offerta.descrizione}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-[#ffd700]">
                        {offerta.prezzo}
                      </span>
                      <span className="text-xs text-white/60">
                        {offerta.validita}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </motion.section>

      <AnimatePresence>
        {zoomIndex !== null && offerte[zoomIndex] && (
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>

            <button
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 rounded-full bg-white/10 border border-white/15 p-3 text-white shadow-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 z-50"
              onClick={(e) => {
                e.stopPropagation();
                nextZoom();
              }}
              disabled={zoomIndex === offerte.length - 1}
              aria-label="Immagine successiva"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
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
                  src={offerte[zoomIndex].immagine || "/placeholder.jpg"}
                  alt={offerte[zoomIndex].titolo}
                  fill
                  sizes="90vw"
                  className="object-contain"
                  priority
                />
                <span className="absolute top-4 right-16 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white/90 text-xs font-semibold uppercase tracking-wide">
                  {offerte[zoomIndex].titolo}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <PreventivoFooter
        eyebrow="Approfitta delle offerte!"
        title="Richiedi un preventivo personalizzato"
        subtitle="Le nostre offerte sono a tempo limitato. Contattaci per maggiori dettagli."
        buttonText="Richiedi la tua offerta"
      />
    </main>
  );
}
