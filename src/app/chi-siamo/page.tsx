"use client";
import React from "react";
import Image from "next/image";

export default function ChiSiamo() {
  return (
    <main className="min-h-screen bg-white font-sans text-[#1A1A1A]">
      {/* HERO: immagine larga con testo bianco sovrapposto */}
      <section className="relative h-[520px] md:h-[640px] overflow-hidden">
        <Image
          src="/gallery2.jpg"
          alt="Hero MarBel"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="max-w-4xl text-center">
            <h1 className="text-white text-5xl md:text-7xl font-extrabold tracking-wide uppercase drop-shadow-lg">
              CHI SIAMO
            </h1>
            <p className="mt-6 text-white text-lg md:text-2xl font-light max-w-2xl mx-auto">
              MarBel — ristrutturazioni che durano, design che emoziona. Dalla
              visione alla realizzazione, con cura artigianale e attenzione al
              dettaglio.
            </p>
          </div>
        </div>
      </section>

      {/* SEZIONE 1: bianco, testo a destra, immagine a sinistra */}
      <section className="w-full py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch px-6">
          <div className="w-full h-[400px] relative">
            <Image
              src="/team.jpg"
              alt="Team MarBel"
              fill
              priority
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex flex-col justify-center px-8 py-12 md:pl-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-wide uppercase text-[#1A2A4E] mb-6">
              LA NOSTRA STORIA
            </h2>
            <p className="text-lg text-[#2A2A2A] leading-relaxed mb-4">
              Da una piccola idea a grandi progetti. Cresciamo insieme, ogni
              giorno, con passione e professionalità.
            </p>
            <p className="text-lg text-[#2A2A2A] leading-relaxed">
              Un team di esperti, sempre aggiornati sulle tecniche e materiali
              più innovativi.
            </p>
          </div>
        </div>
      </section>

      {/* SEZIONE: Testo architettonico, layout split */}
      <section className="w-full py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch px-6">
          <div className="flex flex-col justify-center px-8 py-12 md:pr-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-wide uppercase text-[#1A2A4E] mb-6">
              PROGETTARE CON INTELLETTO, COSTRUIRE CON CURA
            </h2>
            <p className="text-lg text-[#2A2A2A] leading-relaxed mb-4">
              Lavoriamo come studio: progetto, materiali scelti, attenzione ai
              dettagli. Ogni intervento è pensato per durare; ogni finitura
              racconta una scelta precisa.
            </p>
            <p className="text-lg text-[#2A2A2A] leading-relaxed mb-4">
              Crediamo in soluzioni sostenibili e in interventi chiari: zero
              sorprese, tempi rispettati, risultati misurabili.
            </p>
            <ul className="grid gap-2 text-[#2A2A2A] mt-6">
              <li className="uppercase font-semibold">
                Consulenza progettuale
              </li>
              <li className="uppercase font-semibold">
                Gestione pratica e cantiere
              </li>
              <li className="uppercase font-semibold">
                Soluzioni chiavi in mano
              </li>
            </ul>
          </div>
          <div className="w-full h-[400px] relative md:order-2 order-1">
            <Image
              src="/gallery3.jpg"
              alt="Progetto MarBel"
              fill
              priority
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* SEZIONE 2: grigio chiaro, tre frasi a effetto */}
      <section className="w-full bg-[#F7F7F7] py-24">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-16 px-6">
          <h3 className="text-2xl md:text-3xl font-bold tracking-wide uppercase text-[#1A2A4E] text-center">
            DIAMO FORMA ALLE TUE IDEE
          </h3>
          <h3 className="text-2xl md:text-3xl font-bold tracking-wide uppercase text-[#1A2A4E] text-center">
            COSTRUIAMO SICUREZZA E BELLEZZA
          </h3>
          <h3 className="text-2xl md:text-3xl font-bold tracking-wide uppercase text-[#1A2A4E] text-center">
            OGNI PROGETTO È UN VALORE
          </h3>
        </div>
      </section>

      {/* SEZIONE 3: bianco, immagine orizzontale con testo overlay */}
      <section className="w-full relative h-[340px] flex items-center justify-center mb-32">
        <div className="absolute inset-0">
          <Image
            src="/gallery3.jpg"
            alt="Lavori MarBel"
            fill
            priority
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
        </div>
        <div className="relative z-10 w-full flex flex-col items-center">
          <p className="text-white text-2xl md:text-3xl font-light text-center max-w-3xl">
            Ristrutturazioni, restauri, nuove costruzioni: ogni progetto è
            seguito con cura e attenzione ai dettagli.
          </p>
        </div>
      </section>

      {/* IMPACT PHRASES - LARGE UPPERCASE, spaced */}
      <section className="w-full bg-[#F7F7F7] py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h4 className="text-3xl md:text-4xl font-extrabold uppercase tracking-wide text-[#1A1A1A] mb-6">
            OGNI PROGETTO È UN ATTO DI CURA
          </h4>
          <p className="text-lg text-[#2A2A2A] max-w-3xl mx-auto">
            Dal primo sopralluogo alla consegna finale, accompagniamo il cliente
            con chiarezza e progettualità: il risultato è estetica, funzionalità
            e durabilità.
          </p>
        </div>
      </section>

      {/* VALUES GRID — architettonico, senza box */}
      <section className="max-w-6xl mx-auto px-6 py-28 grid grid-cols-1 md:grid-cols-3 gap-14">
        <div>
          <h5 className="text-xl font-bold uppercase text-[#1A2A4E] mb-3">
            Professionalità
          </h5>
          <p className="text-[#2A2A2A] leading-relaxed">
            Precisione, tempi rispettati, team qualificato.
          </p>
        </div>
        <div>
          <h5 className="text-xl font-bold uppercase text-[#1A2A4E] mb-3">
            Qualità
          </h5>
          <p className="text-[#2A2A2A] leading-relaxed">
            Materiali scelti e lavorazioni curate.
          </p>
        </div>
        <div>
          <h5 className="text-xl font-bold uppercase text-[#1A2A4E] mb-3">
            Affidabilità
          </h5>
          <p className="text-[#2A2A2A] leading-relaxed">
            Comunicazione chiara e garanzie sul lavoro.
          </p>
        </div>
      </section>

      {/* PreventivoFooter */}
      {/* Se il componente PreventivoFooter non è disponibile, commenta o rimuovi */}
      {/* <PreventivoFooter /> */}
    </main>
  );
}
// ...existing code...

// SEZIONE: Testo architettonico, layout split
<section className="w-full py-24">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch px-6">
    <div className="flex flex-col justify-center px-8 py-12 md:pr-16">
      <h2 className="text-4xl md:text-5xl font-bold tracking-wide uppercase text-[#1A2A4E] mb-6">
        PROGETTARE CON INTELLETTO, COSTRUIRE CON CURA
      </h2>
      <p className="text-lg text-[#2A2A2A] leading-relaxed mb-4">
        Lavoriamo come studio: progetto, materiali scelti, attenzione ai
        dettagli. Ogni intervento è pensato per durare; ogni finitura racconta
        una scelta precisa.
      </p>
      <p className="text-lg text-[#2A2A2A] leading-relaxed mb-4">
        Crediamo in soluzioni sostenibili e in interventi chiari: zero sorprese,
        tempi rispettati, risultati misurabili.
      </p>
      <ul className="grid gap-2 text-[#2A2A2A] mt-6">
        <li className="uppercase font-semibold">Consulenza progettuale</li>
        <li className="uppercase font-semibold">Gestione pratica e cantiere</li>
        <li className="uppercase font-semibold">Soluzioni chiavi in mano</li>
      </ul>
    </div>
    <div className="w-full h-[400px] relative md:order-2 order-1">
      <Image
        src="/gallery3.jpg"
        alt="Progetto MarBel"
        fill
        priority
        className="object-cover w-full h-full"
      />
    </div>
  </div>
</section>;

{
  /* IMPACT PHRASES - LARGE UPPERCASE, spaced */
}
<section className="w-full bg-[#F7F7F7] py-20">
  <div className="max-w-6xl mx-auto px-6 text-center">
    <h4 className="text-3xl md:text-4xl font-extrabold uppercase tracking-wide text-[#1A1A1A] mb-6">
      OGNI PROGETTO È UN ATTO DI CURA
    </h4>
    <p className="text-lg text-[#2A2A2A] max-w-3xl mx-auto">
      Dal primo sopralluogo alla consegna finale, accompagniamo il cliente con
      chiarezza e progettualità: il risultato è estetica, funzionalità e
      durabilità.
    </p>
  </div>
</section>;

{
  /* VALUES GRID — architettonico, senza box */
}
<section className="max-w-6xl mx-auto px-6 py-28 grid grid-cols-1 md:grid-cols-3 gap-14">
  <div>
    <h5 className="text-xl font-bold uppercase text-[#1A2A4E] mb-3">
      Professionalità
    </h5>
    <p className="text-[#2A2A2A] leading-relaxed">
      Precisione, tempi rispettati, team qualificato.
    </p>
  </div>
  <div>
    <h5 className="text-xl font-bold uppercase text-[#1A2A4E] mb-3">Qualità</h5>
    <p className="text-[#2A2A2A] leading-relaxed">
      Materiali scelti e lavorazioni curate.
    </p>
  </div>
  <div>
    <h5 className="text-xl font-bold uppercase text-[#1A2A4E] mb-3">
      Affidabilità
    </h5>
    <p className="text-[#2A2A2A] leading-relaxed">
      Comunicazione chiara e garanzie sul lavoro.
    </p>
  </div>
</section>;
