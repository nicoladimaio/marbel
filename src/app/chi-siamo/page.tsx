"use client";
import React, { useRef } from "react";
import Image from "next/image";
import SocialBar from "../components/SocialBar";
import PreventivoFooter from "../components/PreventivoFooter";
import { motion, useScroll, useTransform } from "framer-motion";
import { cubicBezier } from "framer-motion";

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
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });
  const heroParallax = useTransform(scrollYProgress, [0, 1], [15, 0]);

  return (
    <main className="min-h-screen bg-white text-[#1a2a4e] font-sans">
      <SocialBar />

      {/* HERO */}
      <section
        ref={heroRef}
        className="relative min-h-[40vh] flex items-center justify-center overflow-hidden"
      >
        <motion.div style={{ y: heroParallax }} className="absolute inset-0">
          <Image
            src="/chi-siamo-hero-2.jpg"
            alt="Studio MarBel"
            fill
            priority
            className="object-cover object-[30%_10%]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-[rgba(0,0,0,0.25)]" />
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="relative z-10 text-center px-6 space-y-3 text-white"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-[0.35em]">
            CHI SIAMO
          </h1>
          <p className="text-lg sm:text-xl text-white/85">
            Costruiamo spazi che parlano di voi, curando ogni fase con
            precisione artigianale.
          </p>
          <span className="inline-block h-px w-16 bg-white/70" />
        </motion.div>
      </section>

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
            <p className="text-sm uppercase tracking-[0.35em] text-[#94a3b8]">
              Chi siamo
            </p>
            <p className="text-xl text-[#475569] leading-relaxed">
              {introText}
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-72 rounded-2xl overflow-hidden shadow-[0_25px_70px_-50px_rgba(15,23,42,0.6)]"
          >
            <Image
              src="/team.jpg"
              alt="Team MarBel"
              fill
              className="object-cover transition-transform duration-500 hover:scale-[1.01]"
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
              <p className="text-sm uppercase tracking-[0.35em] text-[#94a3b8]">
                La nostra storia
              </p>
              <h2 className="text-3xl font-semibold uppercase tracking-[0.25em]">
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
              className="relative border-l border-[#1a2a4e]/30 pl-8 space-y-8"
            >
              {timeline.map((step) => (
                <div key={step.title} className="space-y-1">
                  <p className="text-sm uppercase tracking-[0.35em] text-[#94a3b8]">
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
            <p className="text-sm uppercase tracking-[0.35em] text-[#94a3b8]">
              I nostri valori
            </p>
            <h3 className="text-3xl font-semibold uppercase tracking-[0.25em]">
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
                <div className="text-2xl text-[#1a2a4e] mb-3">
                  {valore.icon}
                </div>
                <h4 className="text-lg font-semibold uppercase tracking-[0.3em] mb-2">
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

      {/* CTA */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="py-24 px-6 bg-[#f5f6fa] text-center"
      >
        <div className="max-w-3xl mx-auto space-y-5">
          <p className="text-sm uppercase tracking-[0.35em] text-[#94a3b8]">
            Vuoi conoscerci meglio?
          </p>
          <h4 className="text-2xl font-semibold uppercase tracking-[0.3em]">
            Scopri i nostri servizi
          </h4>
          <a
            href="/servizi"
            className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-[#1a2a4e] text-white font-semibold shadow-lg shadow-[#1a2a4e]/30 hover:bg-[#223867] transition-colors duration-300"
          >
            Vai ai servizi
          </a>
        </div>
      </motion.section>

      <PreventivoFooter />
    </main>
  );
}
