"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import SocialBar from "../components/SocialBar";
import PreventivoFooter from "../components/PreventivoFooter";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const contactInfo = [
  {
    title: "Telefono",
    value: "02 12345678",
    icon: FaPhone,
    description: "Dal lunedì al venerdì, 9.00–18.30",
  },
  {
    title: "Email",
    value: "info@marbel.it",
    icon: FaEnvelope,
    description: "Rispondiamo entro 24 ore lavorative",
  },
  {
    title: "Indirizzo",
    value: "Via Roma 123, Milano (MI)",
    icon: FaMapMarkerAlt,
    description: "Riceviamo su appuntamento",
  },
];

export default function Contatti() {
  const heroRef = useRef<HTMLElement | null>(null);
  const ctaRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: ctaProgress } = useScroll({
    target: ctaRef,
    offset: ["start end", "end start"],
  });
  const heroParallax = useTransform(heroProgress, [0, 1], [15, -15]);
  const ctaParallax = useTransform(ctaProgress, [0, 1], [15, -15]);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefono: "",
    messaggio: "",
  });
  const [errors, setErrors] = useState({
    nome: "",
    email: "",
    telefono: "",
    messaggio: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = {
      nome: formData.nome ? "" : "Inserisci il tuo nome",
      email: /\S+@\S+\.\S+/.test(formData.email)
        ? ""
        : "Inserisci un'email valida",
      telefono: formData.telefono ? "" : "Inserisci il tuo numero",
      messaggio: formData.messaggio ? "" : "Inserisci il messaggio",
    };
    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some(Boolean);
    if (!hasErrors) {
      console.log("Invio dati:", formData);
      alert("Messaggio inviato! Ti ricontatteremo a breve.");
      setFormData({ nome: "", email: "", telefono: "", messaggio: "" });
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f6fa] text-[#1a2a4e]">
      <SocialBar />

      {/* HERO */}
      <section
        ref={heroRef}
        className="relative min-h-[45vh] flex items-center justify-center overflow-hidden px-6 pt-24"
      >
        <motion.div style={{ y: heroParallax }} className="absolute inset-0">
          <Image
            src="/contatti-hero.jpg"
            alt="Contattaci MarBel"
            fill
            priority
            className="object-cover scale-105"
          />
        </motion.div>
        <div className="absolute inset-0 bg-[#1a2a4e]/55" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 text-center text-white space-y-4 max-w-3xl"
        >
          <p className="text-sm uppercase tracking-[0.4em] text-white/80">
            Contattaci
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-[0.35em]">
            Contattaci
          </h1>
          <p className="text-white/85 text-lg sm:text-xl leading-relaxed">
            Siamo qui per aiutarti a realizzare il tuo progetto.
          </p>
        </motion.div>
      </section>

      {/* INFO CONTATTI */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-3">
          {contactInfo.map(({ title, value, description, icon: Icon }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.02 }}
              className="rounded-2xl border border-[#e5e7eb] bg-[#f5f6fa] p-6 shadow-lg shadow-[#0b152e]/10 space-y-3"
            >
              <div className="w-12 h-12 rounded-xl bg-white text-[#1a2a4e] flex items-center justify-center shadow-md">
                <Icon size={22} />
              </div>
              <h3 className="text-lg font-semibold uppercase tracking-[0.25em]">
                {title}
              </h3>
              <p className="text-2xl font-bold text-[#1a2a4e]">{value}</p>
              <p className="text-[#475569]">{description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FORM + MAP */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-xl p-10 space-y-5"
          >
            <p className="text-sm uppercase tracking-[0.4em] text-[#94a3b8]">
              Scrivici
            </p>
            <h2 className="text-3xl font-extrabold uppercase tracking-[0.3em]">
              Richiedi informazioni
            </h2>
            <div className="grid gap-4">
              {[
                { label: "Nome", name: "nome", type: "text" },
                { label: "Email", name: "email", type: "email" },
                { label: "Telefono", name: "telefono", type: "tel" },
              ].map((field) => (
                <div key={field.name}>
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.label}
                    value={formData[field.name as keyof typeof formData]}
                    onChange={handleChange}
                    className={`w-full border rounded-xl px-4 py-3 text-[#1a2a4e] focus:outline-none focus:ring-2 focus:ring-[#1a2a4e]/70 transition-all ${
                      errors[field.name as keyof typeof errors]
                        ? "border-red-400"
                        : "border-[#e5e7eb]"
                    }`}
                  />
                  {errors[field.name as keyof typeof errors] && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors[field.name as keyof typeof errors]}
                    </p>
                  )}
                </div>
              ))}
              <div>
                <textarea
                  name="messaggio"
                  rows={4}
                  placeholder="Messaggio"
                  value={formData.messaggio}
                  onChange={handleChange}
                  className={`w-full border rounded-xl px-4 py-3 text-[#1a2a4e] focus:outline-none focus:ring-2 focus:ring-[#1a2a4e]/70 transition-all ${
                    errors.messaggio ? "border-red-400" : "border-[#e5e7eb]"
                  }`}
                />
                {errors.messaggio && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.messaggio}
                  </p>
                )}
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              type="submit"
              className="w-full px-6 py-3 rounded-2xl bg-[#1a2a4e] text-white font-semibold shadow-xl shadow-[#0b152e]/30 hover:bg-[#223867] transition-colors"
            >
              Invia messaggio
            </motion.button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full min-h-[320px] rounded-2xl overflow-hidden shadow-xl"
          >
            <iframe
              title="MarBel Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2796.7815685218187!2d9.18998231571947!3d45.46421167910156!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDUuNDY0MjExLCA5LjE4OTk4MjM!5e0!3m2!1sit!2sit!4v1700000000000"
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
            ></iframe>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaRef} className="relative py-24 px-6">
        <motion.div style={{ y: ctaParallax }} className="absolute inset-0">
          <Image
            src="/gallery4.jpg"
            alt="CTA Contatti"
            fill
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-[#1a2a4e]/85" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-4xl mx-auto text-center text-white space-y-4"
        >
          <p className="text-sm uppercase tracking-[0.4em] text-white/70">
            Vuoi ricevere un preventivo gratuito?
          </p>
          <h3 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-[0.3em]">
            Raccontaci il tuo progetto
          </h3>
          <p className="text-white/80">
            Ti affianchiamo nella definizione del budget, dei materiali e delle
            tempistiche di cantiere.
          </p>
          <motion.a
            href="/preventivo"
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center justify-center px-8 py-3 rounded-2xl bg-white text-[#1a2a4e] font-semibold shadow-xl shadow-black/30 transition-colors"
          >
            Vai al preventivo
          </motion.a>
        </motion.div>
      </section>

      <PreventivoFooter />
    </main>
  );
}
