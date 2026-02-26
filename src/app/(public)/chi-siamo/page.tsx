"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import SocialBar from "../../components/SocialBar";
import PreventivoFooter from "../../components/PreventivoFooter";
import { motion, cubicBezier } from "framer-motion";
import Hero from "../../components/Hero";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: cubicBezier(0.22, 1, 0.36, 1) },
  },
};
const introText =
  "MarBel nasce con l’idea di rendere semplice ogni fase: ascolto, progettazione e consegna chiavi in mano coordinata da un unico interlocutore.";

const timeline = [
  {
    title: "Fondazione",
    text: "Piccolo studio artigiano che unisce tecnici e maestranze locali.",
  },
  {
    title: "Crescita",
    text: "Apertura di nuovi cantieri chiavi in mano e gestione digitale dei processi.",
  },
  {
    title: "Oggi",
    text: "Team multidisciplinare con approccio sartoriale e controllo qualità costante.",
  },
];

const valori = [
  {
    title: "Precisione",
    icon: "•",
    text: "Ogni dettaglio è tracciato, misurato, approvato insieme.",
  },
  {
    title: "Ascolto",
    icon: "•",
    text: "Un unico referente per dialoghi chiari e aggiornamenti costanti.",
  },
  {
    title: "Durabilità",
    icon: "•",
    text: "Materiali selezionati e verifiche continue in cantiere.",
  },
];

export default function ChiSiamo() {
  return (
    <main className="min-h-screen bg-white text-[#317614] font-sans">
      <SocialBar />

      {/* HERO */}

      <Hero
        image="/hero-chi-siamo-new.jpg"
        title="Chi siamo"
        subtitle="Una storia fatta di passione, competenza e risultati"
        height="min-h-[40vh]"
        darkness={35}
        centerImage={true}
      />

      {/* INTRO */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="py-24 px-6 bg-white"
      >
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.22em] text-[#94a3b8]">
              Chi siamo
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold uppercase tracking-[0.1em] text-[#1E2A22] leading-tight">
              Un solo partner, dall&apos;idea alla consegna
            </h2>
            {/* Immagine operai solo mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-48 w-full rounded-2xl overflow-hidden shadow-[0_12px_40px_-20px_rgba(15,23,42,0.25)] mb-4 block sm:hidden"
            >
              <Image
                src="/team.jpg"
                alt="Team MarBel"
                fill
                className="object-cover"
                priority
              />
            </motion.div>
            <p className="text-lg sm:text-xl text-[#475569] leading-relaxed">
              {introText}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="rounded-xl border border-[#e2e8e4] bg-[#f8faf9] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.22em] text-[#64748b]">
                  Referente unico
                </p>
                <p className="text-sm font-semibold text-[#1E2A22] mt-1">
                  Gestione chiara
                </p>
              </div>
              <div className="rounded-xl border border-[#e2e8e4] bg-[#f8faf9] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.22em] text-[#64748b]">
                  Cantiere controllato
                </p>
                <p className="text-sm font-semibold text-[#1E2A22] mt-1">
                  Qualità costante
                </p>
              </div>
              <div className="rounded-xl border border-[#e2e8e4] bg-[#f8faf9] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.22em] text-[#64748b]">
                  Team interno
                </p>
                <p className="text-sm font-semibold text-[#1E2A22] mt-1">
                  Tempi affidabili
                </p>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-[440px] w-full rounded-3xl overflow-hidden border border-[#e2e8e4] shadow-[0_20px_50px_-30px_rgba(15,23,42,0.35)] hidden sm:block"
          >
            <Image
              src="/team.jpg"
              alt="Team MarBel"
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </div>
      </motion.section>

      {/* LA NOSTRA STORIA */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="py-24 px-6 bg-[#f5f6fa]"
      >
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full h-[550px] rounded-3xl overflow-hidden"
          >
            <Image
              src="/la-nostra-storia-chi-siamo.jpg"
              alt="Progetto MarBel"
              fill
              className="object-cover object-center"
            />
          </motion.div>
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
              <p className="text-sm uppercase tracking-[0.22em] text-[#94a3b8]">
                La nostra storia
              </p>
              <h2 className="text-3xl font-semibold uppercase tracking-[0.14em]">
                Progettare con intelletto, costruire con cura
              </h2>
              <p className="text-lg text-[#475569] leading-relaxed">
                Dal laboratorio artigiano ai progetti su larga scala, MarBel
                evolve mantenendo intatta l’attenzione per il dettaglio e la
                trasparenza con il cliente.
              </p>
            </motion.div>
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative border-l border-[#317614]/30 pl-8 space-y-8"
            >
              {timeline.map((step) => (
                <div key={step.title} className="space-y-1">
                  <p className="text-sm uppercase tracking-[0.22em] text-[#94a3b8]">
                    {step.title}
                  </p>
                  <p className="text-base text-[#475569]">{step.text}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* VALORI */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="py-24 px-6 bg-white"
      >
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.22em] text-[#94a3b8]">
              I nostri valori
            </p>
            <h3 className="text-3xl font-semibold uppercase tracking-[0.14em]">
              La cura in ogni scelta
            </h3>
          </div>
          <div className="grid gap-8 md:grid-cols-3 text-left">
            {valori.map((valore) => (
              <motion.div
                key={valore.title}
                whileHover={{ rotateX: 2, rotateY: -2, scale: 1.01 }}
                className="rounded-2xl border border-[#e5e7eb] p-8 shadow-md transition-transform duration-300"
              >
                <div className="text-2xl text-[#317614] mb-3">
                  {valore.icon}
                </div>
                <h4 className="text-lg font-semibold uppercase tracking-[0.18em] mb-2">
                  {valore.title}
                </h4>
                <p className="text-[#475569] leading-relaxed text-sm">
                  {valore.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CERTIFICAZIONI */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="py-24 px-6 bg-gradient-to-b from-[#f5f6fa] to-[#edf3ef]"
      >
        <div className="max-w-5xl mx-auto text-center space-y-10">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.22em] text-[#94a3b8]">
              Certificazioni
            </p>
            <h3 className="text-3xl font-semibold uppercase tracking-[0.14em]">
              Qualità e sicurezza riconosciute
            </h3>
          </div>
          <div className="grid gap-8 md:grid-cols-3 text-left">
            <div className="rounded-2xl border border-[#d8e2da] bg-white p-8 shadow-[0_20px_50px_-35px_rgba(15,23,42,0.45)]">
              <div className="inline-flex items-center rounded-full bg-[#eaf4eb] px-3 py-1 text-xs font-bold tracking-[0.2em] text-[#256029] mb-4">
                CERT
              </div>
              <h4 className="text-lg font-semibold uppercase tracking-[0.24em] mb-2 text-[#256029]">
                ISO 9001
              </h4>
              <p className="text-[#475569] leading-relaxed text-sm">
                Gestione della qualità certificata per tutti i processi
                aziendali.
              </p>
            </div>
            <div className="rounded-2xl border border-[#d8e2da] bg-white p-8 shadow-[0_20px_50px_-35px_rgba(15,23,42,0.45)]">
              <div className="inline-flex items-center rounded-full bg-[#eaf4eb] px-3 py-1 text-xs font-bold tracking-[0.2em] text-[#256029] mb-4">
                APPALTI
              </div>
              <h4 className="text-lg font-semibold uppercase tracking-[0.24em] mb-2 text-[#256029]">
                SOA OG1
              </h4>
              <p className="text-[#475569] leading-relaxed text-sm">
                Abilitazione a lavori pubblici e grandi appalti nel settore
                edilizio.
              </p>
            </div>
            <div className="rounded-2xl border border-[#d8e2da] bg-white p-8 shadow-[0_20px_50px_-35px_rgba(15,23,42,0.45)]">
              <div className="inline-flex items-center rounded-full bg-[#eaf4eb] px-3 py-1 text-xs font-bold tracking-[0.2em] text-[#256029] mb-4">
                IMPIANTI
              </div>
              <h4 className="text-lg font-semibold uppercase tracking-[0.24em] mb-2 text-[#256029]">
                F-GAS
              </h4>
              <p className="text-[#475569] leading-relaxed text-sm">
                Certificazione per installazione e manutenzione di impianti di
                climatizzazione.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* PARTNERSHIP */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="py-24 px-6 bg-white"
      >
        <div className="max-w-5xl mx-auto text-center space-y-10">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.22em] text-[#94a3b8]">
              Partnership
            </p>
            <h3 className="text-3xl font-semibold uppercase tracking-[0.14em]">
              Collaborazioni di valore
            </h3>
          </div>
          <div className="grid gap-8 md:grid-cols-3 text-left">
            <div className="rounded-2xl border border-[#d8e2da] bg-[#f8faf9] p-8 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.45)] flex flex-col items-center text-center">
              <Image
                src="/partner1.png"
                alt="Rete fornitori certificati"
                width={92}
                height={92}
                className="mb-5"
              />
              <h4 className="text-base font-semibold uppercase tracking-[0.16em] mb-2 text-[#256029]">
                Rete fornitori certificati
              </h4>
              <p className="text-[#475569] leading-relaxed text-sm">
                Collaboriamo con produttori e distributori selezionati per
                garantire materiali affidabili e tempi certi.
              </p>
            </div>
            <div className="rounded-2xl border border-[#d8e2da] bg-[#f8faf9] p-8 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.45)] flex flex-col items-center text-center">
              <Image
                src="/partner2.png"
                alt="Studi tecnici e professionisti"
                width={92}
                height={92}
                className="mb-5"
              />
              <h4 className="text-base font-semibold uppercase tracking-[0.16em] mb-2 text-[#256029]">
                Studi tecnici partner
              </h4>
              <p className="text-[#475569] leading-relaxed text-sm">
                Lavoriamo con professionisti qualificati per pratiche,
                progettazione esecutiva e coordinamento di cantiere.
              </p>
            </div>
            <div className="rounded-2xl border border-[#d8e2da] bg-[#f8faf9] p-8 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.45)] flex flex-col items-center text-center">
              <Image
                src="/partner3.png"
                alt="Partner impiantistici specializzati"
                width={92}
                height={92}
                className="mb-5"
              />
              <h4 className="text-base font-semibold uppercase tracking-[0.16em] mb-2 text-[#256029]">
                Partner impiantistici
              </h4>
              <p className="text-[#475569] leading-relaxed text-sm">
                Team specializzati in idraulica, elettrico e climatizzazione per
                interventi coordinati e certificati.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="py-24 px-6 bg-[#f5f6fa] text-center"
      >
        <div className="max-w-3xl mx-auto space-y-5">
          <p className="text-sm uppercase tracking-[0.22em] text-[#94a3b8]">
            Vuoi conoscerci meglio?
          </p>
          <h4 className="text-2xl font-semibold uppercase tracking-[0.14em]">
            Scopri i nostri servizi
          </h4>
          <Link
            href="/servizi"
            className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-[#317614] text-white font-semibold shadow-lg shadow-[#317614]/30 hover:bg-[#1E2A22] transition-colors duration-300"
          >
            Vai ai servizi
          </Link>
        </div>
      </motion.section>

      {/* CTA FINALE con effetto parallax */}
      <PreventivoFooter
        eyebrow="Da oltre 15 anni nel settore"
        title="Affida la tua casa a professionisti certificati"
        subtitle="Esperienza, affidabilità e un metodo di lavoro collaudato per garantirti risultati senza stress."
        buttonText="Parla con noi"
      />
    </main>
  );
}
