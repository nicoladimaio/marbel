"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import SocialBar from "../components/SocialBar";
import PreventivoFooter from "../components/PreventivoFooter";
import Hero from "../components/Hero";

export default function Preventivo() {
  const [voci, setVoci] = useState<
    { id: string; voce: string; prezzo: string }[]
  >([]);

  useEffect(() => {
    const fetchVoci = async () => {
      const querySnapshot = await getDocs(collection(db, "preventivo"));
      setVoci(
        querySnapshot.docs.map((doc) => {
          const data = doc.data() as { voce: string; prezzo: string };
          return { id: doc.id, voce: data.voce, prezzo: data.prezzo };
        })
      );
    };
    fetchVoci();
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f6fa] flex flex-col items-center font-sans">
      <SocialBar />
      <Hero
        image="/hero-preventivo-new.jpg"
        title="Preventivo"
        subtitle="Consulta le voci di preventivo oppure richiedi una stima personalizzata"
        height="min-h-[40vh]"
        darkness={35}
        centerImage={false}
      />
      <section className="w-full max-w-3xl mb-8">
        <table className="w-full border-collapse rounded-2xl shadow overflow-hidden mb-8">
          <thead>
            <tr>
              <th className="border p-3 bg-blue-50 text-blue-700">Voce</th>
              <th className="border p-3 bg-blue-50 text-blue-700">
                Prezzo (€)
              </th>
            </tr>
          </thead>
          <tbody>
            {voci.length === 0 ? (
              <tr>
                <td colSpan={2} className="text-zinc-500 p-4">
                  Nessuna voce disponibile.
                </td>
              </tr>
            ) : (
              voci.map((v) => (
                <tr key={v.id}>
                  <td className="border p-3 text-zinc-700">{v.voce}</td>
                  <td className="border p-3 text-zinc-700">{v.prezzo}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <form className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-blue-700 mb-2">
            Richiedi preventivo
          </h2>
          <input
            type="text"
            placeholder="Nome"
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="border rounded px-3 py-2"
            required
          />
          <textarea
            placeholder="Descrivi il lavoro"
            className="border rounded px-3 py-2"
            rows={4}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Invia richiesta
          </button>
        </form>
      </section>
      <PreventivoFooter
        eyebrow="Hai domande sul preventivo?"
        title="Parla con un nostro tecnico"
        subtitle="Possiamo aiutarti a capire costi, fasi e tempistiche del tuo progetto."
        buttonText="Contattaci subito"
      />
    </main>
  );
}
