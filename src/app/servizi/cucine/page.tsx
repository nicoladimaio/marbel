"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import SocialBar from "../../components/SocialBar";
import PreventivoFooter from "../../components/PreventivoFooter";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { motion, useScroll, useTransform } from "framer-motion";
import { cubicBezier } from "framer-motion";
import { FaTools, FaHardHat, FaRedo } from "react-icons/fa";

type GalleryItem = {
  id: string;
  titolo: string;
  immagine: string;
};

const methodSteps = [
  {
    title: "Progettazione",
    description:
      "Analizziamo esigenze, metrature e stili per sviluppare un progetto su misura.",
    icon: FaTools,
  },
  {
    title: "Materiali Premium",
    description:
      "Legni certificati, meccanismi evoluti e finiture di alta qualità selezionati insieme.",
    icon: FaHardHat,
  },
  {
    title: "Installazione Perfetta",
    description:
      "Squadre specializzate curano montaggio, collaudi e finitura nei minimi dettagli.",
    icon: FaRedo,
  },
];

const fallbackGallery: GalleryItem[] = [
  { id: "mock-1", titolo: "Cucina Milano", immagine: "/gallery1.jpg" },
  { id: "mock-2", titolo: "Kitchen Loft", immagine: "/gallery2.jpg" },
  { id: "mock-3", titolo: "Atelier Cucina", immagine: "/gallery3.jpg" },
  { id: "mock-4", titolo: "Linea Minimal", immagine: "/gallery4.jpg" },
];

export default function CucineSuMisura() {
  const heroRef = useRef<HTMLElement | null>(null);
  const ctaRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: ctaProgress } = useScroll({
    target: ctaRef,
    offset: ["start end", "end start"],
  });
  const heroParallax = useTransform(heroProgress, [0, 1], [20, -20]);
  const ctaParallax = useTransform(ctaProgress, [0, 1], [15, -15]);

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const snapshot = await getDocs(collection(db, "portfolio_cucine"));
        if (snapshot.empty) {
          setGalleryItems(fallbackGallery);
          return;
        }
        const data = snapshot.docs.map((doc) => {
          const docData = doc.data() as { titolo?: string; immagine?: string };
          return {
            id: doc.id,
            titolo: docData.titolo || "Cucina su misura",
            immagine: docData.immagine || "/gallery1.jpg",
          };
        });
        setGalleryItems(data);
      } catch (error) {
        console.error("Errore nel recupero portfolio_cucine:", error);
        setGalleryItems(fallbackGallery);
      }
    };
    fetchGallery();
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f6fa] text-[#1a2a4e]">
      <SocialBar />

      {/* HERO */}
      <section
        ref={heroRef}
        className="relative min-h-[50vh] flex items-center justify-center overflow-hidden px-6 pt-24"
      >
        <motion.div style={{ y: heroParallax }} className="absolute inset-0">
          <Image
            src="/gallery-cucine.jpg"
            alt="Cucine su misura"
            fill
            priority
            className="object-cover scale-105"
          />
        </motion.div>
        <div className="absolute inset-0 bg-[#1a2a4e]/55" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: cubicBezier(0.22, 1, 0.36, 1) }}
          className="relative z-10 text-center text-white max-w-4xl space-y-4"
        >
          <p className="text-sm uppercase tracking-[0.45em] text-white/75">
            Interior su misura
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-[0.35em]">
            Cucine su misura
          </h1>
          <p className="text-white/85 text-lg sm:text-xl leading-relaxed">
            Progetti personalizzati che uniscono estetica, funzionalità e
            qualità artigianale.
          </p>
        </motion.div>
      </section>

      {/* DESCRIZIONE */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: cubicBezier(0.22, 1, 0.36, 1) }}
            className="w-full lg:w-1/2 space-y-4"
          >
            <p className="text-sm uppercase tracking-[0.4em] text-[#94a3b8]">
              Design sartoriale
            </p>
            <h2 className="text-3xl font-extrabold uppercase tracking-[0.3em]">
              Realizziamo cucine uniche
            </h2>
            <p className="text-lg text-[#475569] leading-relaxed">
              Realizziamo cucine su misura utilizzando materiali di alta
              qualità, progettazione su misura e soluzioni tecniche avanzate.
              Dalla scelta dei materiali all’installazione finale, ogni
              dettaglio è curato con precisione.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: cubicBezier(0.22, 1, 0.36, 1) }}
            className="relative w-full lg:w-1/2 h-72 sm:h-96 rounded-3xl overflow-hidden shadow-2xl"
          >
            <Image
              src="/gallery3.jpg"
              alt="Cucine MarBel"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* METODO */}
      <section className="py-20 px-6 bg-[#f5f6fa]">
        <div className="max-w-6xl mx-auto space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: cubicBezier(0.22, 1, 0.36, 1) }}
            className="text-center space-y-3"
          >
            <p className="text-sm uppercase tracking-[0.4em] text-[#94a3b8]">
              Il nostro metodo
            </p>
            <h3 className="text-3xl font-extrabold uppercase tracking-[0.3em]">
              Dal concept alla posa
            </h3>
          </motion.div>
          <div className="grid gap-8 md:grid-cols-3">
            {methodSteps.map(({ title, description, icon: Icon }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.8,
                  ease: cubicBezier(0.22, 1, 0.36, 1),
                }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="rounded-2xl border border-[#e5e7eb] bg-white p-8 shadow-lg shadow-[#0b152e]/10 space-y-4"
              >
                <div className="w-14 h-14 rounded-xl bg-[#1a2a4e]/10 text-[#1a2a4e] flex items-center justify-center">
                  <Icon size={26} />
                </div>
                <h4 className="text-xl font-bold uppercase tracking-[0.25em]">
                  {title}
                </h4>
                <p className="text-[#475569] leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MINI GALLERY */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: cubicBezier(0.22, 1, 0.36, 1) }}
            className="text-center space-y-3"
          >
            <p className="text-sm uppercase tracking-[0.4em] text-[#94a3b8]">
              Alcune delle nostre realizzazioni
            </p>
            <h3 className="text-3xl font-extrabold uppercase tracking-[0.3em]">
              Portfolio cucine
            </h3>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.7,
                  ease: cubicBezier(0.22, 1, 0.36, 1),
                }}
                className="relative h-64 rounded-2xl overflow-hidden shadow-xl group"
              >
                <Image
                  src={item.immagine || "/gallery1.jpg"}
                  alt={item.titolo}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 text-white space-y-1">
                  <p className="text-sm uppercase tracking-[0.35em] text-white/80">
                    Cucina
                  </p>
                  <h4 className="text-lg font-semibold tracking-[0.2em]">
                    {item.titolo}
                  </h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRIMA & DOPO */}
      <section className="py-20 px-6 bg-[#f5f6fa]">
        <div className="max-w-6xl mx-auto space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: cubicBezier(0.22, 1, 0.36, 1) }}
            className="text-center space-y-2"
          >
            <p className="text-sm uppercase tracking-[0.4em] text-[#94a3b8]">
              Prima & Dopo
            </p>
            <h3 className="text-3xl font-extrabold uppercase tracking-[0.3em]">
              Trasformazioni visibili
            </h3>
          </motion.div>
          <div className="grid gap-8 md:grid-cols-2">
            {[
              {
                label: "Prima",
                text: "Ambiente datato, poca luce, spazi frammentati.",
                image: "/gallery1.jpg",
              },
              {
                label: "Dopo",
                text: "Nuovi volumi, materiali coordinati, luce diffusa.",
                image: "/gallery2.jpg",
              },
            ].map(({ label, text, image }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.8,
                  ease: cubicBezier(0.22, 1, 0.36, 1),
                }}
                className="space-y-4"
              >
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src={image}
                    alt={label}
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="text-lg font-semibold uppercase tracking-[0.3em]">
                  {label}
                </h4>
                <p className="text-[#475569]">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaRef} className="relative py-24 px-6">
        <motion.div style={{ y: ctaParallax }} className="absolute inset-0">
          <Image
            src="/gallery4.jpg"
            alt="CTA cucine"
            fill
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-[#1a2a4e]/85" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: cubicBezier(0.22, 1, 0.36, 1) }}
          className="relative z-10 max-w-4xl mx-auto text-center text-white space-y-5"
        >
          <p className="text-sm uppercase tracking-[0.4em] text-white/70">
            Vuoi una cucina su misura per la tua casa?
          </p>
          <h4 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-[0.3em]">
            Richiedi un preventivo gratuito e senza impegno.
          </h4>
          <p className="text-white/80 text-lg">
            Ti accompagniamo nella progettazione, nella scelta dei materiali e
            nel coordinamento delle squadre per ottenere il risultato che hai in
            mente.
          </p>
          <motion.a
            href="/preventivo"
            whileHover={{ scale: 1.04 }}
            className="inline-flex items-center justify-center px-8 py-3 rounded-2xl bg-white text-[#1a2a4e] font-semibold shadow-xl shadow-black/30 transition-colors"
          >
            Richiedi Preventivo
          </motion.a>
        </motion.div>
      </section>

      <PreventivoFooter />
    </main>
  );
}
