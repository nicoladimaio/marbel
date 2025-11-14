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
    <main className="min-h-screen bg-[#f5f6fa] flex flex-col items-center font-sans">
      <SocialBar />
      <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1a2a4e] mb-8 mt-24">
        I nostri servizi
      </h1>
      <section className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {servizi.map((servizio) => (
          <Link
            key={servizio.key}
            href={`/servizi/${servizio.key}`}
            className="bg-white border border-[#1a2a4e]/20 rounded-2xl shadow-lg p-8 flex flex-col items-center hover:shadow-xl transition-shadow duration-300"
          >
            <Image
              src={servizio.img}
              alt={servizio.titolo}
              width={64}
              height={64}
              className="mb-4"
            />
            <h2 className="text-2xl font-bold text-[#1a2a4e] mb-2 text-center">
              {servizio.titolo}
            </h2>
            <p className="text-[#3a4a5a] text-center mb-2">
              {servizio.descrizione}
            </p>
            <span className="mt-4 px-6 py-2 rounded-xl bg-[#1a2a4e] text-white font-semibold shadow hover:bg-[#274472] transition-colors">
              Scopri di più
            </span>
          </Link>
        ))}
      </section>
      <PreventivoFooter />
    </main>
  );
}
