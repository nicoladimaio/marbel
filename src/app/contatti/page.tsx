"use client";
import Hero from "../components/Hero";
import SocialBar from "../components/SocialBar";
import PreventivoFooter from "../components/PreventivoFooter";
import { motion } from "framer-motion";
import { cubicBezier } from "framer-motion";
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from "@heroicons/react/24/solid";

export default function Contatti() {
  return (
    <main className="min-h-screen bg-[#f5f6fa] text-[#1a2a4e]">
      <SocialBar />

      <Hero
        image="/hero-contatti-new.jpg"
        title="CONTATTACI"
        subtitle="Siamo qui per aiutarti a realizzare il tuo progetto."
        height="min-h-[40vh]"
        darkness={35}
      />

      {/* info cards */}
      <section className="py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto mt-16">
          <div className="bg-[#eef2f7] rounded-3xl shadow-md p-6 flex flex-col items-center text-center sm:items-start sm:text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="w-14 h-14 bg-white rounded-xl shadow flex items-center justify-center mb-5">
              <PhoneIcon className="w-6 h-6 text-[#1a2a4e]" />
            </div>
            <div className="text-xl font-bold uppercase text-[#1a2a4e] mt-3">
              TELEFONO
            </div>
            <div className="text-lg font-semibold text-[#1a2a4e] mt-1.5">
              02 12345678
            </div>
            <div className="text-sm text-[#6b7280] mt-1">
              {"Dal luned\u00ec al venerd\u00ec"}
            </div>
          </div>

          <div className="bg-[#eef2f7] rounded-3xl shadow-md p-6 flex flex-col items-center text-center sm:items-start sm:text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="w-14 h-14 bg-white rounded-xl shadow flex items-center justify-center mb-5">
              <EnvelopeIcon className="w-6 h-6 text-[#1a2a4e]" />
            </div>
            <div className="text-xl font-bold uppercase text-[#1a2a4e] mt-3">
              EMAIL
            </div>
            <div className="text-lg font-semibold text-[#1a2a4e] mt-1.5">
              info@marbel.it
            </div>
            <div className="text-sm text-[#6b7280] mt-1">
              Ti rispondiamo entro 24 ore
            </div>
          </div>

          <div className="bg-[#eef2f7] rounded-3xl shadow-md p-6 flex flex-col items-center text-center sm:items-start sm:text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="w-14 h-14 bg-white rounded-xl shadow flex items-center justify-center mb-5">
              <MapPinIcon className="w-6 h-6 text-[#1a2a4e]" />
            </div>
            <div className="text-xl font-bold uppercase text-[#1a2a4e] mt-3">
              INDIRIZZO
            </div>
            <div className="text-lg font-semibold text-[#1a2a4e] mt-1.5">
              Via Nazario Sauro 36, Marcianise (CE)
            </div>
            <div className="text-sm text-[#6b7280] mt-1">
              Riceviamo su appuntamento
            </div>
          </div>
        </div>
      </section>

      {/* form + map */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto mt-10 grid md:grid-cols-2 gap-10 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: cubicBezier(0.22, 1, 0.36, 1) }}
            className="bg-white rounded-2xl border border-[#e5e7eb] shadow-[0_20px_45px_rgba(11,21,46,0.08)] p-8 flex flex-col h-full"
          >
            <span className="text-xs tracking-[0.3em] uppercase text-[#1a2a4e]/70">
              Scrivici
            </span>
            <h3 className="text-3xl font-semibold text-[#1a2a4e] mt-2">
              Richiedi informazioni
            </h3>
            <form className="mt-6 space-y-4 flex-1">
              <input
                type="text"
                placeholder="Nome"
                className="w-full border border-[#e5e7eb] rounded-xl px-4 py-3 text-[#1a2a4e] focus:outline-none focus:ring-2 focus:ring-[#1a2a4e]/40"
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full border border-[#e5e7eb] rounded-xl px-4 py-3 text-[#1a2a4e] focus:outline-none focus:ring-2 focus:ring-[#1a2a4e]/40"
                required
              />
              <input
                type="tel"
                placeholder="Telefono"
                className="w-full border border-[#e5e7eb] rounded-xl px-4 py-3 text-[#1a2a4e] focus:outline-none focus:ring-2 focus:ring-[#1a2a4e]/40"
              />
              <textarea
                placeholder="Messaggio"
                rows={5}
                className="w-full border border-[#e5e7eb] rounded-xl px-4 py-3 text-[#1a2a4e] focus:outline-none focus:ring-2 focus:ring-[#1a2a4e]/40"
                required
              />
              <button
                type="submit"
                className="w-full bg-[#1a2a4e] text-white font-semibold rounded-xl py-3 hover:bg-[#102046] transition-colors"
              >
                Invia richiesta
              </button>
            </form>
          </motion.div>

          <div className="rounded-2xl border border-[#e5e7eb] shadow-[0_20px_45px_rgba(11,21,46,0.05)] overflow-hidden h-full min-h-[420px]">
            <iframe
              title="MarBel Location"
              src="https://www.google.com/maps?q=Via+Nazario+Sauro+36,+Marcianise+(CE)&output=embed"
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>

      <PreventivoFooter />
    </main>
  );
}
