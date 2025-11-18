"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import Image from "next/image";
import SocialBar from "../components/SocialBar";
import PreventivoFooter from "../components/PreventivoFooter";

export default function Offerte() {
  const [offerte, setOfferte] = useState<
    { id: string; titolo: string; descrizione: string; immagine: string }[]
  >([]);

  useEffect(() => {
    const fetchOfferte = async () => {
      const querySnapshot = await getDocs(collection(db, "offerte"));
      setOfferte(
        querySnapshot.docs.map((doc) => {
          const data = doc.data() as {
            titolo: string;
            descrizione: string;
            immagine: string;
          };
          return {
            id: doc.id,
            titolo: data.titolo,
            descrizione: data.descrizione,
            immagine: data.immagine,
          };
        })
      );
    };
    fetchOfferte();
  }, []);

  function OffertaCard({
    offerta,
    index,
  }: {
    offerta: {
      id: string;
      titolo: string;
      descrizione: string;
      immagine: string;
    };
    index: number;
  }) {
    return (
      <div className="group bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row hover:-translate-y-2 transition-transform duration-500">
        <div className="relative w-full lg:w-1/2 h-64">
          <Image
            src={offerta.immagine || "/placeholder.jpg"}
            alt={offerta.titolo}
            fill
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>
        <div className="flex-1 p-8 space-y-4">
          <p className="text-sm uppercase tracking-[0.4em] text-[#94a3b8]">
            Pacchetto {String(index + 1).padStart(2, "0")}
          </p>
          <h3 className="text-2xl font-extrabold uppercase tracking-wide text-[#1a2a4e]">
            {offerta.titolo}
          </h3>
          <p className="text-lg text-[#475569] leading-relaxed">
            {offerta.descrizione}
          </p>
          <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1a2a4e] text-white font-semibold shadow-lg shadow-[#1a2a4e]/40 hover:bg-[#223867] transition-colors duration-300">
            CHIEDI UN PREVENTIVO
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f6fa] text-[#1a2a4e] font-sans">
      <SocialBar />

      {/* HERO */}
      <section className="relative min-h-[420px] flex items-center justify-center overflow-hidden">
        <Image
          src="/gallery1.jpg"
          alt="Offerte speciali"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        <div className="relative z-10 max-w-4xl text-center px-6 space-y-4">
          <p className="text-sm uppercase tracking-[0.4em] text-white/80">
            Pacchetti dedicati
          </p>
          <h1 className="text-white text-4xl sm:text-5xl font-extrabold uppercase tracking-[0.35em]">
            OFFERTE
          </h1>
          <p className="text-white/85 text-lg sm:text-xl font-medium">
            Soluzioni curate per cucine, bagni e riqualificazioni con tempi e
            budget definiti.
          </p>
        </div>
      </section>

      {/* LISTA OFFERTE */}
      <section className="w-full py-24 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <p className="text-sm uppercase tracking-[0.4em] text-[#94a3b8]">
              Limited Edition
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-wide">
              PACCHETTI SU MISURA
            </h2>
            <p className="text-lg text-[#475569] max-w-3xl mx-auto">
              Selezioniamo materiali premium, gestiamo i fornitori e consegniamo
              un progetto chiavi in mano coordinato da un unico interlocutore.
            </p>
          </div>

          {offerte.length === 0 ? (
            <div className="text-[#94a3b8] text-center py-16 rounded-2xl bg-white shadow-lg">
              Nessuna offerta disponibile
            </div>
          ) : (
            <div className="grid gap-10">
              {offerte.map((offerta, index) => (
                <OffertaCard key={offerta.id} offerta={offerta} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      <PreventivoFooter />
    </main>
  );
}
