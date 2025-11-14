import React from "react";
import Image from "next/image";
import SocialBar from "../components/SocialBar";
import PreventivoFooter from "../components/PreventivoFooter";

export default function Contatti() {
  return (
    <main className="min-h-screen bg-[#f5f6fa] flex flex-col items-center font-sans">
      <SocialBar />
      <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1a2a4e] mb-8 mt-24">
        Contatti
      </h1>
      <section className="max-w-2xl w-full mb-8">
        <div className="mb-6 text-center">
          <p className="text-lg text-[#3a4a5a]">
            Telefono: <span className="font-bold">+39 0123 456789</span>
          </p>
          <p className="text-lg text-zinc-700">
            Email: <span className="font-bold">info@marbel.it</span>
          </p>
          <p className="text-lg text-zinc-700">Indirizzo: Via Roma 1, Milano</p>
        </div>
        <div className="mb-8 flex justify-center">
          <Image
            src="/mappa.jpg"
            alt="Mappa"
            width={400}
            height={200}
            className="rounded shadow"
          />
        </div>
        <form className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-blue-700 mb-2">
            Scrivici un messaggio
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
            placeholder="Messaggio"
            className="border rounded px-3 py-2"
            rows={4}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Invia
          </button>
        </form>
      </section>
      <PreventivoFooter />
    </main>
  );
}
