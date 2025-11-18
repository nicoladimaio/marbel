"use client";
import React from "react";
import Image from "next/image";

export default function ChiSiamo() {
  const highlightStatements = [
    "DIAMO FORMA ALLE TUE IDEE",
    "COSTRUIAMO SICUREZZA E BELLEZZA",
    "OGNI PROGETTO È UN VALORE",
  ];

  const values = [
    {
      title: "Professionalità",
      text: "Precisione, tempi rispettati e team qualificato in ogni fase.",
    },
    {
      title: "Qualità",
      text: "Materiali selezionati, dettagli curati e finiture sartoriali.",
    },
    {
      title: "Affidabilità",
      text: "Comunicazione chiara, garanzie sui lavori e supporto costante.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f5f6fa] text-[#1a2a4e]">
      {/* HERO */}
      <section className="relative min-h-[520px] md:min-h-[640px] overflow-hidden">
        <Image
          src="/gallery2.jpg"
          alt="Hero MarBel"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center gap-6">
          <p className="text-sm uppercase tracking-[0.4em] text-white/80">
            MarBel Studio
          </p>
          <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-[0.35em] uppercase">
            CHI SIAMO
          </h1>
          <p className="text-white/90 text-lg md:text-2xl font-medium max-w-3xl">
            MarBel è ristrutturazioni che durano, design che emoziona. Dalla
            visione alla realizzazione, con cura artigianale e attenzione al
            dettaglio.
          </p>
        </div>
      </section>

      {/* STORIA */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1.1fr,0.9fr] gap-10 items-center">
          <div className="relative h-[420px] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/team.jpg"
              alt="Team MarBel"
              fill
              priority
              className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-10 space-y-5">
            <p className="text-sm uppercase tracking-[0.4em] text-[#94a3b8]">
              Metodo
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-wide">
              LA NOSTRA STORIA
            </h2>
            <p className="text-lg text-[#475569] leading-relaxed">
              Da una piccola idea a grandi progetti. Cresciamo insieme, ogni
              giorno, con passione e professionalità. Un team di esperti, sempre
              aggiornati sulle tecniche e materiali più innovativi.
            </p>
          </div>
        </div>
      </section>

      {/* APPROCCIO */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[0.9fr,1.1fr] gap-10 items-center">
          <div className="bg-white rounded-2xl shadow-xl p-10 space-y-5 order-2 md:order-1">
            <p className="text-sm uppercase tracking-[0.4em] text-[#94a3b8]">
              Visione
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-wide">
              PROGETTARE CON INTELLETTO, COSTRUIRE CON CURA
            </h2>
            <p className="text-lg text-[#475569] leading-relaxed">
              Lavoriamo come studio: progetto, materiali scelti e attenzione ai
              dettagli. Ogni intervento è pensato per durare; ogni finitura
              racconta una scelta precisa.
            </p>
            <p className="text-lg text-[#475569] leading-relaxed">
              Crediamo in soluzioni sostenibili e in interventi chiari: zero
              sorprese, tempi rispettati e risultati misurabili.
            </p>
            <ul className="grid gap-3 mt-6">
              {["Consulenza progettuale", "Gestione pratica e cantiere", "Soluzioni chiavi in mano"].map(
                (item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm uppercase tracking-[0.3em] font-semibold text-[#1a2a4e]"
                  >
                    <span className="h-1.5 w-10 bg-[#1a2a4e] block rounded-full" />
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>
          <div className="relative h-[420px] rounded-2xl overflow-hidden shadow-2xl order-1 md:order-2">
            <Image
              src="/gallery3.jpg"
              alt="Progetto MarBel"
              fill
              priority
              className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* HIGHLIGHT STATEMENTS */}
      <section className="py-24 bg-[#f7f7f7] px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {highlightStatements.map((statement) => (
            <div
              key={statement}
              className="bg-white rounded-2xl shadow-lg p-8 text-center uppercase text-xl font-extrabold tracking-[0.3em] hover:-translate-y-1 transition-transform"
            >
              {statement}
            </div>
          ))}
        </div>
      </section>

      {/* IMMERSIVE SECTION */}
      <section className="relative h-[360px] flex items-center justify-center my-10 mx-6 rounded-2xl overflow-hidden shadow-2xl">
        <Image
          src="/gallery3.jpg"
          alt="Lavori MarBel"
          fill
          priority
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-4xl text-center px-6">
          <p className="text-white text-2xl md:text-3xl font-medium leading-relaxed">
            Ristrutturazioni, restauri, nuove costruzioni: ogni progetto è
            seguito con cura e attenzione ai dettagli.
          </p>
        </div>
      </section>

      {/* IMPACT PHRASE */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-10 text-center space-y-6">
          <h3 className="text-3xl md:text-4xl font-extrabold uppercase tracking-[0.3em]">
            OGNI PROGETTO È UN ATTO DI CURA
          </h3>
          <p className="text-lg text-[#475569] leading-relaxed">
            Dal primo sopralluogo alla consegna finale, accompagniamo il cliente
            con chiarezza e progettualità: il risultato è estetica,
            funzionalità e durabilità.
          </p>
        </div>
      </section>

      {/* VALUES GRID */}
      <section className="py-24 px-6 bg-[#f7f7f7]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {values.map((value) => (
            <div
              key={value.title}
              className="bg-white rounded-2xl shadow-lg p-8 border border-[#e5e7eb] hover:-translate-y-1 transition-transform"
            >
              <h4 className="text-xl font-extrabold uppercase tracking-[0.2em] mb-3">
                {value.title}
              </h4>
              <p className="text-[#475569] leading-relaxed">{value.text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
