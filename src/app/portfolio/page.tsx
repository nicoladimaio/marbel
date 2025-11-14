"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useRef } from "react";
import Image from "next/image";
import SocialBar from "../components/SocialBar";
import PreventivoFooter from "../components/PreventivoFooter";

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
      className={`relative w-full overflow-hidden rounded-2xl cursor-pointer group transition-all duration-1000 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ minHeight: 220 }}
      onClick={onClick}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        className="object-cover w-full h-full rounded-2xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:brightness-90 group-hover:-rotate-1"
        priority={false}
      />
      <div className="absolute inset-0 pointer-events-none rounded-2xl group-hover:ring-4 group-hover:ring-blue-400 transition-all duration-300" />
    </div>
  );
}

// MODALE ZOOM MIGLIORATA: immagine centrata, frecce ai margini, X in alto a destra, lente e fullscreen
import { Fragment } from "react";

export default function Portfolio() {
  const [items, setItems] = useState<
    { id: string; titolo: string; immagine: string; categoria?: string }[]
  >([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState("TUTTE");
  const [gridVisible, setGridVisible] = useState(false);
  const [zoomSrc, setZoomSrc] = useState<string | null>(null);
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, "portfolio"));
      setItems(
        querySnapshot.docs.map((doc) => {
          const data = doc.data() as {
            titolo: string;
            immagine: string;
            categoria?: string;
          };
          return {
            id: doc.id,
            titolo: data.titolo,
            immagine: data.immagine,
            categoria: data.categoria || "",
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
    new Set(items.map((i) => i.categoria).filter((c) => c && c.trim()))
  );
  const lavoriFiltrati = items.filter(
    (i) => categoriaFiltro === "TUTTE" || i.categoria === categoriaFiltro
  );

  // Funzione per aprire la modale su una certa immagine
  const openZoom = (idx: number) => {
    setZoomIndex(idx);
    setFullscreen(false);
  };
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
    <main className="min-h-screen bg-[#f5f6fa] flex flex-col items-center font-sans">
      <SocialBar />
      {/* HERO con immagine di sfondo */}
      <div className="relative w-full h-[320px] sm:h-[400px] flex items-center justify-center mb-8">
        {/* ...hero... */}
      </div>
      <section className="w-full mb-8">
        <p className="text-lg text-[#3a4a5a] mb-4 text-center">
          Alcuni dei nostri lavori realizzati: ristrutturazioni, nuove
          costruzioni, restauri e molto altro.
        </p>
        {/* Menù orizzontale categorie centrato */}
        <div className="w-full flex justify-center mb-6">
          <div className="flex gap-2 min-w-max pb-2">
            <button
              className={`px-4 py-2 rounded-full font-semibold shadow text-sm transition whitespace-nowrap ${
                categoriaFiltro === "TUTTE"
                  ? "bg-[#1a2a4e] text-white"
                  : "bg-gray-200 text-[#1a2a4e]"
              }`}
              onClick={() => setCategoriaFiltro("TUTTE")}
            >
              TUTTE
            </button>
            {categorie.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full font-semibold shadow text-sm transition whitespace-nowrap ${
                  categoriaFiltro === cat
                    ? "bg-[#1a2a4e] text-white"
                    : "bg-gray-200 text-[#1a2a4e]"
                }`}
                onClick={() => setCategoriaFiltro(cat || "")}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        {/* Griglia immagini masonry con margine minimo ai lati */}
        <div
          className={`transition-all duration-700 ${
            gridVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <div className="columns-1 sm:columns-2 md:columns-3 xl:columns-6 gap-4 [column-fill:_balance] w-full mx-1 sm:mx-2">
            {/* effetto masonry */}
            {lavoriFiltrati.length === 0 ? (
              <div className="text-zinc-500 col-span-full text-center py-8">
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
      <PreventivoFooter />
    </main>
  );
}
