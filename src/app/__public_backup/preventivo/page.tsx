"use client";
import React, { useState } from "react";
import SocialBar from "../components/SocialBar";
import PreventivoFooter from "../components/PreventivoFooter";
import Hero from "../components/Hero";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebaseConfig";

const servizi = [
  "Ristrutturazione completa",
  "Impianto elettrico",
  "Impianto idraulico",
  "Tinteggiatura",
  "Cartongesso",
  "Pavimentazione",
  "Altro",
];

export default function Preventivo() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefono: "",
    servizio: servizi[0],
    dettagli: "",
  });
  const [inviato, setInviato] = useState(false);
  const [errore, setErrore] = useState("");
  const [caricamento, setCaricamento] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCaricamento(true);
    setErrore("");
    try {
      await addDoc(collection(db, "preventivi"), form);
      setInviato(true);
    } catch (err) {
      setErrore("Errore durante l'invio. Riprova.");
    } finally {
      setCaricamento(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f6fa] text-[#1a2a4e]">
      <SocialBar />

      <Hero
        image="/hero-preventivo.jpg"
        title="Richiedi un preventivo"
        subtitle="Compila il modulo per ricevere una proposta personalizzata"
        height="min-h-[40vh]"
        darkness={35}
        centerImage={true}
      />

      <section className="py-16 px-6 bg-white">
        <div className="max-w-2xl mx-auto rounded-3xl shadow-xl p-8">
          {inviato ? (
            <div className="text-center text-green-600 text-xl font-semibold">
              Grazie! La tua richiesta è stata inviata con successo.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="nome"
                  className="block text-sm font-medium mb-1"
                >
                  Nome e Cognome
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2a4e]"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2a4e]"
                />
              </div>
              <div>
                <label
                  htmlFor="telefono"
                  className="block text-sm font-medium mb-1"
                >
                  Telefono
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2a4e]"
                />
              </div>
              <div>
                <label
                  htmlFor="servizio"
                  className="block text-sm font-medium mb-1"
                >
                  Servizio richiesto
                </label>
                <select
                  id="servizio"
                  name="servizio"
                  value={form.servizio}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2a4e]"
                >
                  {servizi.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="dettagli"
                  className="block text-sm font-medium mb-1"
                >
                  Dettagli aggiuntivi
                </label>
                <textarea
                  id="dettagli"
                  name="dettagli"
                  value={form.dettagli}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2a4e]"
                />
              </div>
              {errore && <div className="text-red-600">{errore}</div>}
              <button
                type="submit"
                disabled={caricamento}
                className="w-full py-3 rounded-full bg-[#1a2a4e] text-white font-semibold shadow-lg hover:bg-[#223867] transition-all duration-250 disabled:opacity-60"
              >
                {caricamento ? "Invio in corso..." : "Invia richiesta"}
              </button>
            </form>
          )}
        </div>
      </section>

      <PreventivoFooter
        eyebrow="Richiedi un preventivo gratuito"
        title="Siamo pronti ad aiutarti"
        subtitle="Compila il modulo e ti ricontatteremo al più presto."
        buttonText="Torna alla home"
      />
    </main>
  );
}
