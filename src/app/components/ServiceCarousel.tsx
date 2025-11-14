"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

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

export default function ServiceCarousel() {
  const [page, setPage] = useState(0);
  const perPage = 4;
  const maxPage = Math.ceil(servizi.length / perPage) - 1;
  const visible = servizi.slice(page * perPage, page * perPage + perPage);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-4 w-full">
        {visible.map((servizio) => (
          <Link
            key={servizio.key}
            href={`/servizi/${servizio.key}`}
            className="bg-white border border-[#1a2a4e]/20 rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-shadow duration-300 min-h-[180px]"
          >
            <Image
              src={servizio.img}
              alt={servizio.titolo}
              width={56}
              height={56}
              className="mb-3"
            />
            <h2 className="text-lg font-bold text-[#1a2a4e] mb-1 text-center">
              {servizio.titolo}
            </h2>
            <p className="text-[#3a4a5a] text-center mb-2 text-sm">
              {servizio.descrizione}
            </p>
            <span className="mt-2 px-4 py-1 rounded-xl bg-[#1a2a4e] text-white font-semibold shadow hover:bg-[#274472] transition-colors text-sm">
              Scopri di più
            </span>
          </Link>
        ))}
      </div>
      <div className="flex gap-4 mt-2">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className={`px-4 py-2 rounded-full bg-[#f5f6fa] text-[#1a2a4e] font-bold shadow hover:bg-[#e0e3ea] transition-all duration-200 disabled:opacity-40`}
          aria-label="Precedente"
        >
          &#8592;
        </button>
        <button
          onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
          disabled={page === maxPage}
          className={`px-4 py-2 rounded-full bg-[#f5f6fa] text-[#1a2a4e] font-bold shadow hover:bg-[#e0e3ea] transition-all duration-200 disabled:opacity-40`}
          aria-label="Successivo"
        >
          &#8594;
        </button>
      </div>
    </div>
  );
}
