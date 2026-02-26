"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import Image from "next/image";
import SocialBar from "../../components/SocialBar";
import { AnimatePresence, motion, cubicBezier } from "framer-motion";
import Hero from "../../components/Hero";
import PreventivoFooter from "../../components/PreventivoFooter";
import { FaWhatsapp } from "react-icons/fa";
import { FiMail } from "react-icons/fi";

const CONTACT_ENDPOINT =
  process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? "/api/contact";
type ModalStatus = "idle" | "loading" | "success" | "error";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: cubicBezier(0.22, 1, 0.36, 1) },
  },
};

function OfferModal({
  title,
  isOpen,
  onClose,
}: {
  title: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(
    `Vorrei informazioni sull'offerta: ${title}`,
  );
  const [status, setStatus] = useState<ModalStatus>("idle");
  const [error, setError] = useState("");
  const [contactMode, setContactMode] = useState<"none" | "whatsapp" | "form">(
    "none",
  );

  useEffect(() => {
    if (isOpen) {
      setFullName("");
      setPhone("");
      setEmail("");
      setMessage(`Vorrei informazioni sull'offerta: ${title}`);
      setStatus("idle");
      setError("");
      setContactMode("none");
    }
  }, [isOpen, title]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      setError("Nome e telefono sono obbligatori.");
      return;
    }

    setStatus("loading");
    setError("");

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          email,
          message,
          body: message,
        }),
      });

      if (!response.ok) {
        throw new Error("Invio non riuscito. Riprova tra poco.");
      }

      setStatus("success");
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Si e' verificato un errore. Riprova.";
      setError(msg);
      setStatus("error");
    }
  };

  const isSubmitting = status === "loading";
  const whatsappMessage = `Vorrei informazioni sull'offerta: ${title}`;
  const whatsappLink = `https://wa.me/?text=${encodeURIComponent(
    whatsappMessage,
  )}`;
  const handleWhatsappClick = () => {
    window.open(whatsappLink, "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg bg-white rounded-2xl px-8 py-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 text-[#317614] hover:text-[#223867] text-xl font-bold"
              aria-label="Chiudi"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold text-[#317614] mb-1">
              Come vuoi essere contattato?
            </h3>
            <p className="text-sm text-[#475569] mb-5">
              Scegli il metodo che preferisci per l&rsquo;offerta &ldquo;{title}
              &rdquo;.
            </p>

            {contactMode !== "form" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <button
                  type="button"
                  onClick={handleWhatsappClick}
                  className="flex items-center gap-3 p-4 border border-[#e2e8f0] rounded-2xl shadow-sm hover:shadow-md hover:border-[#22c55e]/50 transition duration-200 text-left"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#22c55e]/10 text-[#22c55e]">
                    <FaWhatsapp size={24} />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-base font-semibold text-[#317614]">
                      WhatsApp
                    </span>
                    <span className="text-sm text-[#475569]">
                      Contatto immediato
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setContactMode("form")}
                  className="flex items-center gap-3 p-4 border border-[#e2e8f0] rounded-2xl shadow-sm hover:shadow-md hover:border-[#317614]/40 transition duration-200 text-left"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#317614]/10 text-[#317614]">
                    <FiMail size={22} />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-base font-semibold text-[#317614]">
                      Modulo online
                    </span>
                    <span className="text-sm text-[#475569]">
                      Compila in 30 secondi
                    </span>
                  </span>
                </button>
              </div>
            )}

            <AnimatePresence initial={false}>
              {contactMode === "form" && (
                <motion.form
                  key="contact-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 pt-2"
                  onSubmit={handleSubmit}
                >
                  <button
                    type="button"
                    onClick={() => setContactMode("none")}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#317614] hover:text-[#223867] transition-colors"
                  >
                    <span className="text-lg">←</span>
                    <span>Indietro</span>
                  </button>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#317614]">
                      Nome*
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-xl border border-[#e2e8f0] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#317614]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#317614]">
                      Telefono*
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-[#e2e8f0] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#317614]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#317614]">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-[#e2e8f0] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#317614]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#317614]">
                      Messaggio
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full rounded-xl border border-[#e2e8f0] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#317614]"
                    />
                  </div>
                  {error && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                      {error}
                    </p>
                  )}
                  {status === "success" && (
                    <p className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                      Richiesta inviata. Ti contatteremo a breve.
                    </p>
                  )}
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-3 rounded-xl border border-[#e2e8f0] text-[#317614] font-semibold hover:bg-[#f5f6fa] transition-colors"
                    >
                      Annulla
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 rounded-xl bg-[#317614] text-white font-semibold shadow-lg shadow-[#317614]/30 hover:bg-[#223867] transition-colors disabled:opacity-60"
                    >
                      {isSubmitting ? "Invio..." : "Invia richiesta"}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const faqs = [
  {
    question: "Le offerte comprendono la direzione lavori?",
    answer:
      "Sì, ogni pacchetto include project manager dedicato, report digitali e coordinamento squadre.",
  },
  {
    question: "Posso personalizzare i materiali?",
    answer:
      "Selezioniamo marchi premium e possiamo adattare il pacchetto alle tue esigenze estetiche e funzionali.",
  },
  {
    question: "Quanto durano le promozioni?",
    answer:
      "Le promozioni restano attive fino a esaurimento disponibilità; ti aggiorniamo durante il brief iniziale.",
  },
  {
    question: "Gestite anche pratiche e incentivi?",
    answer:
      "Curiamo pratiche fiscali e incentivi, affiancandoti nella raccolta documentale e nella gestione ENEA.",
  },
];

export default function Offerte() {
  const [offerte, setOfferte] = useState<
    {
      id: string;
      titolo: string;
      descrizione: string;
      immagine: string;
      visibile?: boolean;
    }[]
  >([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState("");

  useEffect(() => {
    const fetchOfferte = async () => {
      const querySnapshot = await getDocs(collection(db, "offerte"));
      setOfferte(
        querySnapshot.docs
          .map((doc) => {
            const data = doc.data() as {
              titolo: string;
              descrizione: string;
              immagine: string;
              visibile?: boolean;
            };
            return {
              id: doc.id,
              titolo: data.titolo,
              descrizione: data.descrizione,
              immagine: data.immagine,
              visibile: data.visibile !== false,
            };
          })
          .filter((item) => item.visibile),
      );
    };
    fetchOfferte();
  }, []);

  const fallbackOffers = [
    {
      id: "fallback-1",
      titolo: "Bagno boutique express",
      descrizione:
        "Nuove superfici, box doccia frameless e accessoristica premium in 20 giorni.",
      immagine: "/gallery1.jpg",
    },
    {
      id: "fallback-2",
      titolo: "Cucina sartoriale smart",
      descrizione:
        "Pensili su misura, top tecnico e integrazione domotica completa.",
      immagine: "/gallery2.jpg",
    },
    {
      id: "fallback-3",
      titolo: "Riqualificazione energetica",
      descrizione:
        "Cappotto, infissi e consulenza incentivi coordinata dal nostro studio.",
      immagine: "/gallery3.jpg",
    },
  ];

  const showcase = (offerte.length ? offerte : fallbackOffers).slice(0, 4);

  function OffertaCard({
    offerta,
    index,
    onOpenModal,
  }: {
    offerta: {
      id: string;
      titolo: string;
      descrizione: string;
      immagine: string;
    };
    index: number;
    onOpenModal: (title: string) => void;
  }) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{
          duration: 0.7,
          delay: index * 0.1,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="group bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row"
        whileHover={{ y: -8 }}
      >
        <div className="relative w-full lg:w-1/2 h-64 overflow-hidden">
          <Image
            src={offerta.immagine || "/placeholder.jpg"}
            alt={offerta.titolo}
            fill
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>
        <div className="flex-1 p-10 space-y-5">
          <div className="flex items-center gap-3 text-sm uppercase tracking-[0.4em] text-[#94a3b8]">
            <span className="h-2 w-2 rounded-full bg-[#317614]" />
            Pacchetto {String(index + 1).padStart(2, "0")}
          </div>
          <h3 className="text-3xl font-extrabold uppercase tracking-wide text-[#317614]">
            {offerta.titolo}
          </h3>
          <p className="text-lg text-[#475569] leading-[1.65]">
            {offerta.descrizione}
          </p>
          <button
            type="button"
            onClick={() => onOpenModal(offerta.titolo)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#317614] text-white font-semibold uppercase tracking-[0.15em] shadow-lg shadow-[#317614]/40 hover:bg-[#1E2A22] transition-colors duration-300"
          >
            RICHIEDI INFORMAZIONI
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f6fa] text-[#317614] font-sans">
      <SocialBar />

      {/* HERO */}

      <Hero
        image="/hero-offerte-new.jpg"
        title="Le nostre offerte"
        subtitle="Selezione di pacchetti chiavi in mano per intervenire subito su cucine, bagni e riqualificazioni."
        height="min-h-[40vh]"
        darkness={35}
        centerImage={true}
      />
      {/* CARDS */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto space-y-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center space-y-4"
          >
            <p className="text-sm uppercase tracking-[0.4em] text-[#94a3b8]">
              Pacchetti limitati
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-wide">
              Offerte su misura
            </h2>
            <p className="text-lg text-[#475569] max-w-3xl mx-auto">
              Materiali premium, timeline definite e un unico project manager
              dedicato, per attivare il cantiere senza sorprese.
            </p>
          </motion.div>

          {showcase.length === 0 ? (
            <div className="text-[#94a3b8] text-center py-16 rounded-2xl bg-white shadow-lg">
              Nessuna offerta disponibile
            </div>
          ) : (
            <div className="grid gap-10">
              {showcase.map((offerta, index) => (
                <OffertaCard
                  key={offerta.id}
                  offerta={offerta}
                  index={index}
                  onOpenModal={(title) => {
                    setSelectedTitle(title);
                    setIsModalOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* BLOCCO PROMO */}
      <section className="py-28 px-6 bg-[#f5f6fa]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4"
          >
            <p className="text-sm uppercase tracking-[0.4em] text-[#94a3b8]">
              Promo dedicata
            </p>
            <h3 className="text-3xl font-extrabold uppercase tracking-wide">
              Cucine e bagni chiavi in mano, tempi certi.
            </h3>
            <p className="text-lg text-[#475569] leading-relaxed">
              Coordinamento fornitori, mockup 3D, direzione lavori certificata:
              tutto dentro un’unica offerta trasparente.
            </p>
            <a
              href="/preventivo"
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-[#317614] text-white font-semibold shadow-lg shadow-[#317614]/30 hover:bg-[#1E2A22] transition-colors duration-300"
            >
              Richiedi un preventivo
            </a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-80 rounded-3xl overflow-hidden shadow-2xl"
          >
            <Image
              src="/gallery3.jpg"
              alt="Promo MarBel"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-5xl mx-auto space-y-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center space-y-3"
          >
            <p className="text-sm uppercase tracking-[0.4em] text-[#94a3b8]">
              Faq
            </p>
            <h3 className="text-3xl font-extrabold uppercase tracking-wide">
              Domande frequenti
            </h3>
          </motion.div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="rounded-2xl border border-[#e5e7eb] bg-[#f7f7f7] p-4 shadow-sm"
              >
                <button
                  className="w-full flex justify-between items-center text-left"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="text-sm uppercase tracking-[0.3em] font-semibold">
                    {faq.question}
                  </span>
                  <span>{openFaq === index ? "–" : "+"}</span>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: openFaq === index ? "auto" : 0,
                    opacity: openFaq === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="mt-3 text-[#475569] text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINALE */}

      <PreventivoFooter
        eyebrow="Pronto a iniziare? "
        title="Approfitta delle promozioni attive"
        subtitle="Sconti stagionali e pacchetti dedicati per ristrutturazioni complete o interventi mirati."
        buttonText="Richiedi la tua offerta"
      />
      <OfferModal
        title={selectedTitle}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}
