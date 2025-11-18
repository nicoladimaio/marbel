"use client";
import React from "react";
import Image from "next/image";
import SocialBar from "../components/SocialBar";
import PreventivoFooter from "../components/PreventivoFooter";

export default function Contatti() {
  return (
    <main className="min-h-screen bg-[#f5f6fa] text-[#1a2a4e] font-sans">
      <SocialBar />

      {/* HERO */}
      <section className="relative min-h-[360px] flex items-center justify-center overflow-hidden px-6 pt-24 text-center">
        <Image
          src="/gallery3.jpg"
          alt="Contatti MarBel"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="relative z-10 max-w-3xl space-y-4 text-white">
          <p className="text-sm uppercase tracking-[0.4em] text-white/80">
            Sempre a disposizione
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-[0.35em]">
            CONTATTI
          </h1>
          <p className="text-lg sm:text-xl text-white/85 leading-relaxed">
            Telefono, email e consulenze dedicate: scegli il canale più comodo e
            parlaci del tuo progetto.
          </p>
        </div>
      </section>

      {/* INFO + FORM */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10">
          <div className="bg-white rounded-2xl shadow-xl p-10 space-y-6">
            <p className="text-sm uppercase tracking-[0.4em] text-[#94a3b8]">
              Dettagli
            </p>
            <h2 className="text-3xl font-extrabold uppercase tracking-wide">
              COME CI PUOI TROVARE
            </h2>
            <div className="space-y-3 text-lg text-[#475569]">
              <p>
                Telefono: <span className="font-semibold">+39 0123 456789</span>
              </p>
              <p>
                Email: <span className="font-semibold">info@marbel.it</span>
              </p>
              <p>Indirizzo: Via Roma 1, Milano</p>
            </div>
            <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/mappa.jpg"
                alt="Mappa"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
          </div>

          <form className="bg-white rounded-2xl shadow-xl p-10 space-y-4">
            <p className="text-sm uppercase tracking-[0.4em] text-[#94a3b8]">
              Scrivici
            </p>
            <h3 className="text-2xl font-extrabold uppercase tracking-wide">
              Richiedi informazioni
            </h3>
            <input
              type="text"
              placeholder="Nome"
              className="border border-[#e5e7eb] rounded-xl px-4 py-3 text-[#1a2a4e]"
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="border border-[#e5e7eb] rounded-xl px-4 py-3 text-[#1a2a4e]"
              required
            />
            <textarea
              placeholder="Messaggio"
              rows={4}
              className="border border-[#e5e7eb] rounded-xl px-4 py-3 text-[#1a2a4e]"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#1a2a4e] text-white font-semibold shadow-lg shadow-[#1a2a4e]/30 hover:bg-[#223867] transition-colors"
            >
              Invia
            </button>
          </form>
        </div>
      </section>

      <PreventivoFooter />
    </main>
  );
}
