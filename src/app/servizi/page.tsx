"use client";
import Link from "next/link";
import Image from "next/image";
import SocialBar from "../components/SocialBar";
import PreventivoFooter from "../components/PreventivoFooter";

const servizi = [
  {
    key: "pavimenti",
    titolo: "Ristrutturazione pavimenti",
    descrizione: "Rinnovo e posa di pavimenti in ogni ambiente.",
    img: "/service1.png",
  },
  {
    key: "cucine",
    titolo: "Ristrutturazione cucine",
    descrizione: "Progettazione e rifacimento cucine moderne e funzionali.",
    img: "/service2.png",
  },
  {
    key: "bagni",
    titolo: "Ristrutturazione bagni",
    descrizione: "Restyling completo di bagni, sanitari e rivestimenti.",
    img: "/service3.png",
  },
  {
    key: "elettrici",
    titolo: "Impianti elettrici",
    descrizione: "Installazione e adeguamento impianti elettrici a norma.",
    img: "/service1.png",
  },
  {
    key: "idraulici",
    titolo: "Impianti idraulici",
    descrizione: "Realizzazione e manutenzione impianti idraulici efficienti.",
    img: "/service2.png",
  },
  // Puoi aggiungere altri servizi qui
];

export default function Servizi() {
  return (
    <main className="min-h-screen bg-[#f5f6fa] text-[#1a2a4e]">
      <SocialBar />

      {/* HERO */}
      <section className="relative min-h-[360px] flex items-center justify-center overflow-hidden px-6 pt-24">
        <Image
          src="/gallery1.jpg"
          alt="Servizi MarBel"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="relative z-10 max-w-3xl text-center space-y-4">
          <p className="text-sm uppercase tracking-[0.4em] text-white/80">
            Squadre specializzate
          </p>
          <h1 className="text-white text-4xl sm:text-5xl font-extrabold uppercase tracking-[0.35em]">
            I NOSTRI SERVIZI
          </h1>
          <p className="text-white/85 text-lg sm:text-xl leading-relaxed">
            Progetti chiavi in mano: cucine, bagni, impianti e riqualificazioni
            seguiti da un unico project manager.
          </p>
        </div>
      </section>

      {/* GRID SERVIZI */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {servizi.map((servizio) => (
            <Link
              key={servizio.key}
              href={`/servizi/${servizio.key}`}
              className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-start gap-4 border border-[#e5e7eb] hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="w-16 h-16 rounded-full bg-[#f5f6fa] flex items-center justify-center shadow-inner">
                <Image
                  src={servizio.img}
                  alt={servizio.titolo}
                  width={42}
                  height={42}
                />
              </div>
              <p className="text-sm uppercase tracking-[0.4em] text-[#94a3b8]">
                Servizio
              </p>
              <h2 className="text-2xl font-extrabold uppercase tracking-wide">
                {servizio.titolo}
              </h2>
              <p className="text-lg text-[#475569]">{servizio.descrizione}</p>
              <span className="mt-auto inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1a2a4e] text-white font-semibold shadow-lg shadow-[#1a2a4e]/30 hover:bg-[#223867] transition-colors">
                Scopri di più
              </span>
            </Link>
          ))}
        </div>
      </section>

      <PreventivoFooter />
    </main>
  );
}
