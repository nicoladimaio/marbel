"use client";
import React, { useEffect, useState, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import Image from "next/image";
import SocialBar from "../components/SocialBar";
import { motion, useScroll, useTransform } from "framer-motion";
import { cubicBezier } from "framer-motion";
import Hero from "../components/Hero";
import PreventivoFooter from "../components/PreventivoFooter";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: cubicBezier(0.22, 1, 0.36, 1) },
  },
};

const faqs = [
  {
    question: "Le offerte comprendono la direzione lavori?",
    answer:
      "Sì, ogni pacchetto include project manager dedicato, report digitali e coordinamento squadre.",
  },
  {
    question: "Posso personalizzare i materiali?",
    answer:
      "Selezioniamo marchi premium e possiamo adattare il pacchetto alle tue esigenze estetiche e funzionali.",
  },
  {
    question: "Quanto durano le promozioni?",
    answer:
      "Le promozioni restano attive fino a esaurimento disponibilità; ti aggiorniamo durante il brief iniziale.",
  },
  {
    question: "Gestite anche pratiche e incentivi?",
    answer:
      "Curiamo pratiche fiscali e incentivi, affiancandoti nella raccolta documentale e nella gestione ENEA.",
  },
];

export default function Offerte() {
  const [offerte, setOfferte] = useState<
    { id: string; titolo: string; descrizione: string; immagine: string }[]
  >([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const fetchOfferte = async () => {
      const querySnapshot = await getDocs(collection(db, "offerte"));
      setOfferte(
        querySnapshot.docs.map((doc) => {
          const data = doc.data() as {
            titolo: string;
            descrizione: string;
            immagine: string;
          };
          return {
            id: doc.id,
            titolo: data.titolo,
            descrizione: data.descrizione,
            immagine: data.immagine,
          };
        })
      );
    };
    fetchOfferte();
  }, []);

  const fallbackOffers = [
    {
      id: "fallback-1",
      titolo: "Bagno boutique express",
      descrizione:
        "Nuove superfici, box doccia frameless e accessoristica premium in 20 giorni.",
      immagine: "/gallery1.jpg",
    },
    {
      id: "fallback-2",
      titolo: "Cucina sartoriale smart",
      descrizione:
        "Pensili su misura, top tecnico e integrazione domotica completa.",
      immagine: "/gallery2.jpg",
    },
    {
      id: "fallback-3",
      titolo: "Riqualificazione energetica",
      descrizione:
        "Cappotto, infissi e consulenza incentivi coordinata dal nostro studio.",
      immagine: "/gallery3.jpg",
    },
  ];

  const showcase = (offerte.length ? offerte : fallbackOffers).slice(0, 4);

  function OffertaCard({
    offerta,
    index,
  }: {
    offerta: {
      id: string;
      titolo: string;
      descrizione: string;
      immagine: string;
    };
    index: number;
  }) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{
          duration: 0.7,
          delay: index * 0.1,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="group bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row"
        whileHover={{ y: -8 }}
      >
        <div className="relative w-full lg:w-1/2 h-64 overflow-hidden">
          <Image
            src={offerta.immagine || "/placeholder.jpg"}
            alt={offerta.titolo}
            fill
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>
        <div className="flex-1 p-10 space-y-5">
          <div className="flex items-center gap-3 text-sm uppercase tracking-[0.4em] text-[#94a3b8]">
            <span className="h-2 w-2 rounded-full bg-[#1a2a4e]" />
            Pacchetto {String(index + 1).padStart(2, "0")}
          </div>
          <h3 className="text-3xl font-extrabold uppercase tracking-wide text-[#1a2a4e]">
            {offerta.titolo}
          </h3>
          <p className="text-lg text-[#475569] leading-[1.65]">
            {offerta.descrizione}
          </p>
          <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1a2a4e] text-white font-semibold shadow-lg shadow-[#1a2a4e]/40 hover:bg-[#223867] transition-colors duration-300">
            Chiedi un preventivo
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f6fa] text-[#1a2a4e] font-sans">
      <SocialBar />

      {/* HERO */}

      <Hero
        image="/hero-offerte-new.jpg"
        title="Le nostre offerte"
        subtitle="Selezione di pacchetti chiavi in mano per intervenire subito su cucine, bagni e riqualificazioni."
        height="min-h-[40vh]"
        darkness={35}
        centerImage={true}
      />
      {/* CARDS */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto space-y-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center space-y-4"
          >
            <p className="text-sm uppercase tracking-[0.4em] text-[#94a3b8]">
              Pacchetti limitati
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-wide">
              Offerte su misura
            </h2>
            <p className="text-lg text-[#475569] max-w-3xl mx-auto">
              Materiali premium, timeline definite e un unico project manager
              dedicato, per attivare il cantiere senza sorprese.
            </p>
          </motion.div>

          {showcase.length === 0 ? (
            <div className="text-[#94a3b8] text-center py-16 rounded-2xl bg-white shadow-lg">
              Nessuna offerta disponibile
            </div>
          ) : (
            <div className="grid gap-10">
              {showcase.map((offerta, index) => (
                <OffertaCard key={offerta.id} offerta={offerta} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* BLOCCO PROMO */}
      <section className="py-28 px-6 bg-[#f5f6fa]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4"
          >
            <p className="text-sm uppercase tracking-[0.4em] text-[#94a3b8]">
              Promo dedicata
            </p>
            <h3 className="text-3xl font-extrabold uppercase tracking-wide">
              Cucine e bagni chiavi in mano, tempi certi.
            </h3>
            <p className="text-lg text-[#475569] leading-relaxed">
              Coordinamento fornitori, mockup 3D, direzione lavori certificata:
              tutto dentro un’unica offerta trasparente.
            </p>
            <a
              href="/preventivo"
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-[#1a2a4e] text-white font-semibold shadow-lg shadow-[#1a2a4e]/30 hover:bg-[#223867] transition-colors duration-300"
            >
              Richiedi un preventivo
            </a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-80 rounded-3xl overflow-hidden shadow-2xl"
          >
            <Image
              src="/gallery3.jpg"
              alt="Promo MarBel"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-5xl mx-auto space-y-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center space-y-3"
          >
            <p className="text-sm uppercase tracking-[0.4em] text-[#94a3b8]">
              Faq
            </p>
            <h3 className="text-3xl font-extrabold uppercase tracking-wide">
              Domande frequenti
            </h3>
          </motion.div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="rounded-2xl border border-[#e5e7eb] bg-[#f7f7f7] p-4 shadow-sm"
              >
                <button
                  className="w-full flex justify-between items-center text-left"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="text-sm uppercase tracking-[0.3em] font-semibold">
                    {faq.question}
                  </span>
                  <span>{openFaq === index ? "–" : "+"}</span>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: openFaq === index ? "auto" : 0,
                    opacity: openFaq === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="mt-3 text-[#475569] text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINALE */}

      <PreventivoFooter
        eyebrow="Pronto a iniziare? "
        title="Approfitta delle promozioni attive"
        subtitle="Sconti stagionali e pacchetti dedicati per ristrutturazioni complete o interventi mirati."
        buttonText="Richiedi la tua offerta"
      />
    </main>
  );
}
