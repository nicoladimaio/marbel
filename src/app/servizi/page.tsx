"use client";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import SocialBar from "../components/SocialBar";
import PreventivoFooter from "../components/PreventivoFooter";
import { motion, useScroll, useTransform } from "framer-motion";
import { cubicBezier } from "framer-motion";
import {
  FiLayers,
  FiDroplet,
  FiPackage,
  FiTool,
  FiZap,
  FiGrid,
  FiShield,
  FiAward,
} from "react-icons/fi";
import Hero from "../components/Hero";

const services = [
  {
    title: "Ristrutturazioni complete",
    description:
      "Coordinamento totale di demolizioni, impianti e finiture con un unico project manager.",
    icon: FiLayers,
    href: "/servizi",
  },
  {
    title: "Bagni e spa sartoriali",
    description:
      "Rivestimenti waterproof, illuminazione scenografica e accessori di alta gamma.",
    icon: FiDroplet,
    href: "/servizi/bagni",
  },
  {
    title: "Cucine su misura",
    description:
      "Layout funzionali, integrazione elettrodomestici e materiali premium per la zona living.",
    icon: FiPackage,
    href: "/servizi/cucine",
  },
  {
    title: "Impianti idraulici",
    description:
      "Realizziamo e adeguiamo impianti idrici certificati con tecnici specializzati.",
    icon: FiTool,
    href: "/servizi/idraulici",
  },
  {
    title: "Impianti elettrici",
    description:
      "Quadri, distribuzione e domotica seguendo le normative CEI e tempi garantiti.",
    icon: FiZap,
    href: "/servizi/elettrici",
  },
  {
    title: "Pavimenti e rivestimenti",
    description:
      "Posa sartoriale di superfici tecniche e naturali per interni ed esterni.",
    icon: FiGrid,
    href: "/servizi/pavimenti",
  },
];

const premiumReasons = [
  {
    title: "Project management dedicato",
    description:
      "Un referente unico coordina squadre, fornitori e tempistiche in ogni fase.",
    icon: FiShield,
  },
  {
    title: "Materiali certificati",
    description:
      "Selezioniamo finiture e impianti premium per garantire durabilità e performance.",
    icon: FiAward,
  },
  {
    title: "Squadre specializzate",
    description:
      "Tecnici interni e partner fidati seguono opere murarie, impiantistiche e decorative.",
    icon: FiTool,
  },
  {
    title: "Approccio sartoriale",
    description:
      "Ogni spazio è progettato insieme al cliente, con moodboard e mockup condivisi.",
    icon: FiLayers,
  },
];

export default function Servizi() {
  return (
    <main className="min-h-screen bg-[#f5f6fa] text-[#1a2a4e]">
      <SocialBar />

      {/* HERO */}

      <Hero
        image="/hero-servizi-new.jpg"
        title="I nostri servizi"
        subtitle="Dalla fase di concept alla consegna chiavi in mano, coordiniamo impianti, finiture e forniture con un approccio sartoriale."
        height="min-h-[40vh]"
        darkness={35}
        centerImage={false}
      />

      {/* GRID SERVIZI */}
      <section className="py-24 px-6 bg-white">
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
            <h2 className="text-3xl font-extrabold uppercase tracking-[0.3em]">
              Servizi principali
            </h2>
            <p className="text-[#475569] max-w-3xl mx-auto">
              Seleziona un servizio per approfondire interventi, materiali e
              processi dedicati.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {services.map(({ title, description, icon: Icon, href }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.8,
                  ease: cubicBezier(0.22, 1, 0.36, 1),
                }}
                whileHover={{ y: -8, rotate: 0.5 }}
                className="rounded-2xl border border-[#e5e7eb] bg-[#f5f6fa] p-8 shadow-lg shadow-[#0b152e]/10"
              >
                <div className="w-14 h-14 rounded-xl bg-white text-[#1a2a4e] flex items-center justify-center shadow-md mb-6">
                  <Icon size={28} />
                </div>
                <h3 className="text-xl font-bold uppercase tracking-[0.25em] mb-3">
                  {title}
                </h3>
                <p className="text-[#475569] leading-relaxed mb-6">
                  {description}
                </p>
                <Link
                  href={href}
                  className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-[#1a2a4e] hover:text-[#102046] transition-colors"
                >
                  Scopri di più →
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PREMIUM SECTION */}
      <section className="py-24 px-6 bg-[#f5f6fa]">
        <div className="max-w-6xl mx-auto space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: cubicBezier(0.22, 1, 0.36, 1) }}
            className="text-center space-y-3"
          >
            <p className="text-sm uppercase tracking-[0.4em] text-[#94a3b8]">
              Perché scegliere MarBel
            </p>
            <h2 className="text-3xl font-extrabold uppercase tracking-[0.3em]">
              Approccio premium
            </h2>
            <p className="text-[#475569] max-w-3xl mx-auto">
              Processi digitalizzati, cantieri coordinati e un’estetica coerente
              con il tuo lifestyle.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2">
            {premiumReasons.map(({ title, description, icon: Icon }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.8,
                  ease: cubicBezier(0.22, 1, 0.36, 1),
                }}
                whileHover={{ y: -6 }}
                className="rounded-2xl bg-white/90 border border-[#e5e7eb] p-8 shadow-xl shadow-[#0b152e]/10 flex gap-6"
              >
                <div className="w-14 h-14 rounded-xl bg-[#1a2a4e]/10 text-[#1a2a4e] flex items-center justify-center flex-shrink-0">
                  <Icon size={28} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold uppercase tracking-[0.25em]">
                    {title}
                  </h3>
                  <p className="text-[#475569]">{description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <PreventivoFooter
        eyebrow="Hai un progetto in mente?  "
        title="Scegli il servizio più adatto alle tue esigenze"
        subtitle="Dalla ristrutturazione completa agli impianti, ti offriamo soluzioni su misura e tempi chiari."
        buttonText="Chiedi un preventivo"
      />
    </main>
  );
}
