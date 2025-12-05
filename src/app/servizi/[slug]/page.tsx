"use client";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, cubicBezier, AnimatePresence } from "framer-motion";
import { collection, getDocs, query, where } from "firebase/firestore";
import SocialBar from "../../components/SocialBar";
import PreventivoFooter from "../../components/PreventivoFooter";
import Hero from "../../components/Hero";
import { db } from "../../../firebaseConfig";
import { servicesDetails } from "../../../data/servicesDetails";

type GalleryItem = {
  id: string;
  titolo: string;
  immagine: string;
  categoria?: string;
  descrizione?: string;
};

export default function ServizioDettaglio({}: { params: { slug: string } }) {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? servicesDetails[slug] : undefined;
  if (!service) {
    return notFound();
  }
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!service) return;

    const fetchGallery = async () => {
      try {
        const portfolioQuery = query(
          collection(db, "portfolio"),
          where("categoria", "==", service.portfolioCategory)
        );
        const snapshot = await getDocs(portfolioQuery);
        const data = snapshot.docs
          .map((doc) => {
            const docData = doc.data() as {
              titolo?: string;
              immagine?: string;
              categoria?: string;
              descrizione?: string;
            };
            return {
              id: doc.id,
              titolo: docData.titolo || service.title,
              immagine: docData.immagine || "",
              categoria: docData.categoria || "",
              descrizione: docData.descrizione || "",
            };
          })
          .filter((item) => item.immagine);
        setGalleryItems(data);
      } catch (error) {
        console.error(`Errore portfolio ${service.portfolioCategory}:`, error);
        setGalleryItems([]);
      }
    };

    fetchGallery();
  }, [slug, service]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (zoomIndex === null) return;
      if (event.key === "Escape") {
        setZoomIndex(null);
      }
      if (event.key === "ArrowRight") {
        setZoomIndex((current) => {
          if (current === null) return current;
          if (current >= galleryItems.length - 1) return current;
          return current + 1;
        });
      }
      if (event.key === "ArrowLeft") {
        setZoomIndex((current) => {
          if (current === null) return current;
          if (current <= 0) return current;
          return current - 1;
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zoomIndex, galleryItems.length]);

  return (
    <main className="min-h-screen bg-[#f5f6fa] text-[#1a2a4e]">
      <SocialBar />

      <Hero
        image={service.heroImage}
        title={service.title}
        subtitle={service.subtitle}
        height="min-h-[40vh]"
        darkness={35}
      />

      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: cubicBezier(0.22, 1, 0.36, 1) }}
            className="space-y-5"
          >
            <p className="text-sm uppercase tracking-[0.35em] text-[#94a3b8]">
              Metodo dedicato
            </p>
            <h2 className="text-3xl font-extrabold uppercase tracking-[0.3em]">
              {service.title}
            </h2>
            <p className="text-lg text-[#475569] leading-relaxed">
              {service.subtitle}
            </p>
            <p className="text-[#475569] leading-relaxed">
              Coordiniamo progettazione, forniture e posa con un project manager
              unico, mantenendo tempi e standard qualitativi allineati al tuo
              progetto.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pt-24 pb-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, ease: cubicBezier(0.22, 1, 0.36, 1) }}
            className="text-center space-y-3"
          >
            <p className="text-sm uppercase tracking-[0.4em] text-[#94a3b8]">
              Soluzioni su misura
            </p>
            <h3 className="text-2xl font-bold uppercase tracking-[0.28em]">
              Cosa curiamo per te
            </h3>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: cubicBezier(0.22, 1, 0.36, 1) }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {service.descriptionBlocks.map(({ title, text, icon: Icon }) => (
              <motion.div
                key={title}
                whileHover={{ y: -6, scale: 1.01 }}
                className="rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] p-6 shadow-lg shadow-[#0b152e]/10 space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-[#1a2a4e]/10 text-[#1a2a4e] flex items-center justify-center">
                  <Icon size={22} />
                </div>
                <h3 className="text-lg font-bold uppercase tracking-[0.25em]">
                  {title}
                </h3>
                <p className="text-[#475569] leading-relaxed text-sm">{text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#f5f6fa]">
        <div className="max-w-6xl mx-auto space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, ease: cubicBezier(0.22, 1, 0.36, 1) }}
            className="text-center space-y-3"
          >
            <p className="text-sm uppercase tracking-[0.4em] text-[#94a3b8]">
              Portfolio selezionato
            </p>
            <h3 className="text-3xl font-extrabold uppercase tracking-[0.3em]">
              Progetti {service.title.toLowerCase()}
            </h3>
            <p className="text-[#475569] max-w-3xl mx-auto">
              Una selezione di realizzazioni legate a questo servizio,
              aggiornata tramite il portfolio Firebase.
            </p>
          </motion.div>

          {galleryItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#cbd5f5] bg-white p-10 text-center text-[#94a3b8]">
              Nessun progetto disponibile in questa categoria.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {galleryItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.05,
                    ease: cubicBezier(0.22, 1, 0.36, 1),
                  }}
                  whileHover={{ scale: 1.04 }}
                  onClick={() => setZoomIndex(index)}
                  className="relative h-64 rounded-2xl overflow-hidden shadow-xl group bg-white cursor-pointer"
                >
                  <Image
                    src={item.immagine}
                    alt={item.titolo}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-4 left-4 text-white space-y-1">
                    <p className="text-sm uppercase tracking-[0.35em] text-white/80"></p>
                    <h4 className="text-lg font-semibold tracking-[0.2em]"></h4>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {zoomIndex !== null && galleryItems[zoomIndex] && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomIndex(null)}
          >
            <button
              className="absolute top-4 right-4 rounded-full bg-white/10 border border-white/15 p-3 text-white hover:bg-white/20 transition-colors z-50"
              onClick={(e) => {
                e.stopPropagation();
                setZoomIndex(null);
              }}
              aria-label="Chiudi"
            >
              &times;
            </button>
            <button
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 rounded-full bg-white/10 border border-white/15 p-3 text-white shadow-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 z-50"
              onClick={(e) => {
                e.stopPropagation();
                setZoomIndex((current) => {
                  if (current === null) return current;
                  if (current <= 0) return current;
                  return current - 1;
                });
              }}
              disabled={zoomIndex === 0}
              aria-label="Immagine precedente"
            >
              ‹
            </button>
            <button
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 rounded-full bg-white/10 border border-white/15 p-3 text-white shadow-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 z-50"
              onClick={(e) => {
                e.stopPropagation();
                setZoomIndex((current) => {
                  if (current === null) return current;
                  if (current >= galleryItems.length - 1) return current;
                  return current + 1;
                });
              }}
              disabled={zoomIndex === galleryItems.length - 1}
              aria-label="Immagine successiva"
            >
              ›
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
                  src={galleryItems[zoomIndex].immagine}
                  alt={galleryItems[zoomIndex].titolo}
                  fill
                  sizes="90vw"
                  className="object-contain"
                  priority
                />
                <span className="absolute top-4 right-16 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white/90 text-xs font-semibold uppercase tracking-wide">
                  {galleryItems[zoomIndex].categoria ||
                    service.portfolioCategory}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <PreventivoFooter
        eyebrow="Hai un progetto in mente?"
        title={service.ctaTitle}
        subtitle={service.ctaSubtitle}
        buttonText={service.ctaButtonText}
      />
    </main>
  );
}
