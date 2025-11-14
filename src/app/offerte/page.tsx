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

  // COMPONENTE OffertaCard
  function OffertaCard({
    offerta,
  }: {
    offerta: {
      id: string;
      titolo: string;
      descrizione: string;
      immagine: string;
    };
  }) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg flex flex-col sm:flex-row items-center overflow-hidden mb-8">
        <div className="w-full sm:w-1/3 h-56 sm:h-64 relative flex-shrink-0">
          <Image
            src={offerta.immagine || "/placeholder.jpg"}
            alt={offerta.titolo}
            fill
            className="object-cover w-full h-full"
          />
        </div>
        <div className="w-full sm:w-2/3 p-6 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-[#1a2a4e] mb-2">
            {offerta.titolo}
          </h2>
          <p className="text-base text-[#3a4a5a] mb-4">{offerta.descrizione}</p>
          <button className="mt-4 px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition self-start cursor-pointer">
            CHIEDI UN PREVENTIVO
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f6fa] flex flex-col items-center font-sans">
      <SocialBar />
      <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1a2a4e] mb-8 mt-24">
        Offerte
      </h1>
      <section className="w-full py-8">
        {offerte.length === 0 ? (
          <div className="text-zinc-500 text-center py-8">
            Nessuna offerta disponibile
          </div>
        ) : (
          offerte.map((offerta) => (
            <OffertaCard key={offerta.id} offerta={offerta} />
          ))
        )}
      </section>
      <PreventivoFooter />
    </main>
  );
}
