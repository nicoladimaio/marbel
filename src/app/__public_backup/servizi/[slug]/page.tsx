"use client";
import React from "react";
import { useParams } from "next/navigation";
import { servicesDetails } from "../../data/servicesDetails";
import SocialBar from "../../components/SocialBar";
import PreventivoFooter from "../../components/PreventivoFooter";
import Hero from "../../components/Hero";

export default function ServizioDettaglio() {
  const { slug } = useParams();
  const servizio = servicesDetails[slug as string];

  if (!servizio) {
    return (
      <main className="min-h-screen bg-[#f5f6fa] text-[#1a2a4e]">
        <SocialBar />
        <Hero
          image="/hero-servizi.jpg"
          title="Servizio non trovato"
          subtitle="Il servizio richiesto non esiste."
          height="min-h-[40vh]"
          darkness={35}
          centerImage={true}
        />
        <div className="max-w-2xl mx-auto py-16 text-center text-xl text-[#1a2a4e]">
          Siamo spiacenti, il servizio richiesto non è disponibile.
        </div>
        <PreventivoFooter
          eyebrow="Non hai trovato il servizio?"
          title="Contattaci per una consulenza personalizzata"
          subtitle="Siamo a tua disposizione per ogni esigenza."
          buttonText="Torna ai servizi"
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f6fa] text-[#1a2a4e]">
      <SocialBar />
      <Hero
        image={servizio.heroImage || "/hero-servizi.jpg"}
        title={servizio.titolo}
        subtitle={servizio.sottotitolo}
        height="min-h-[40vh]"
        darkness={35}
        centerImage={true}
      />
      <section className="py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-4">{servizio.titolo}</h2>
          <p className="mb-6 text-lg text-[#334155]">{servizio.descrizione}</p>
          {servizio.punti && (
            <ul className="list-disc pl-6 space-y-2 mb-6">
              {servizio.punti.map((p: string, i: number) => (
                <li key={i} className="text-[#475569]">
                  {p}
                </li>
              ))}
            </ul>
          )}
          {servizio.immagini && servizio.immagini.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {servizio.immagini.map((img: string, i: number) => (
                <img
                  key={i}
                  src={img}
                  alt={servizio.titolo}
                  className="rounded-xl shadow-md object-cover w-full h-56"
                />
              ))}
            </div>
          )}
        </div>
      </section>
      <PreventivoFooter
        eyebrow="Vuoi saperne di più?"
        title="Richiedi una consulenza gratuita"
        subtitle="Siamo pronti ad aiutarti a realizzare il tuo progetto."
        buttonText="Richiedi informazioni"
      />
    </main>
  );
}
