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
    <main className="min-h-screen bg-[#f5f6fa] text-[#1a2a4e]">
      <SocialBar />

      {/* HERO */}
      <section className="relative min-h-[420px] flex items-center justify-center overflow-hidden">
        <Image
          src="/gallery2.jpg"
          alt="Portfolio MarBel"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="relative z-10 max-w-4xl text-center px-6 space-y-4">
          <p className="text-sm uppercase tracking-[0.4em] text-white/80">
            Realizzazioni
          </p>
          <h1 className="text-white text-4xl sm:text-5xl font-extrabold uppercase tracking-[0.35em]">
            PORTFOLIO
          </h1>
          <p className="text-white/85 text-lg sm:text-xl leading-relaxed">
            Una selezione di cantieri chiavi in mano: interventi strutturali,
            interior design e riqualificazioni coordinate da un unico team.
          </p>
        </div>
      </section>

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
                  categoriaFiltro === "TUTTE"
                    ? "bg-[#1a2a4e] text-white shadow-lg shadow-[#1a2a4e]/30"
                    : "border border-[#e5e7eb] bg-white text-[#1a2a4e] hover:bg-[#f5f6fa]"
                }`}
                onClick={() => setCategoriaFiltro("TUTTE")}
              >
                TUTTE
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
              gridVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
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
      <PreventivoFooter />
    </main>
  );
}
