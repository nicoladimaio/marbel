"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { motion, cubicBezier } from "framer-motion";
import { db } from "../../../firebaseConfig";
import SocialBar from "../../components/SocialBar";
import PreventivoFooter from "../../components/PreventivoFooter";
import Hero from "../../components/Hero";

const CONTACT_ENDPOINT =
  process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? "/api/contact";

const WORK_TOGGLE_FIELDS = [
  "bagni",
  "controsoffitto",
  "condizionatori",
  "cucina",
] as const;

const WORK_DETAIL_BY_TOGGLE = {
  bagni: "numeroBagni",
  controsoffitto: "mqControsoffitto",
  condizionatori: "numeroCondizionatori",
  cucina: "noteCucina",
} as const;

const PLANTS_OPTIONS = [
  { key: "elettrico", label: "Impianto elettrico" },
  { key: "idraulico", label: "Impianto idraulico" },
  { key: "gas", label: "Impianto gas" },
  { key: "termoidraulico", label: "Impianto termoidraulico" },
] as const;

type WorkToggleKey = (typeof WORK_TOGGLE_FIELDS)[number];
type WorkDetailKey = (typeof WORK_DETAIL_BY_TOGGLE)[WorkToggleKey];
type PlantKey = (typeof PLANTS_OPTIONS)[number]["key"];

const WORKS_UI_CONFIG: {
  key: WorkToggleKey;
  label: string;
  detailLabel: string;
  placeholder: string;
  type: "number" | "textarea";
  min?: number;
}[] = [
  {
    key: "bagni",
    label: "Bagni",
    detailLabel: "Numero bagni",
    placeholder: "Quanti?",
    type: "number",
    min: 1,
  },
  {
    key: "controsoffitto",
    label: "Controsoffitto",
    detailLabel: "Metri quadri controsoffitto",
    placeholder: "Indica i metri quadri",
    type: "number",
    min: 5,
  },
  {
    key: "condizionatori",
    label: "Condizionatori",
    detailLabel: "Numero condizionatori",
    placeholder: "Indica il numero",
    type: "number",
    min: 1,
  },
  {
    key: "cucina",
    label: "Cucina",
    detailLabel: "Note cucina",
    placeholder: "Materiali, disposizioni o esigenze particolari",
    type: "textarea",
  },
];

type PreventivoFormState = {
  squareMeters: string;
  floor: string;
  constructionYear: string;
  works: {
    bagni: boolean;
    numeroBagni: string;
    controsoffitto: boolean;
    mqControsoffitto: string;
    condizionatori: boolean;
    numeroCondizionatori: string;
    cucina: boolean;
    noteCucina: string;
  };
  plants: Record<PlantKey, boolean>;
  description: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
};
type SimpleFieldKey =
  | "squareMeters"
  | "floor"
  | "constructionYear"
  | "description"
  | "fullName"
  | "email"
  | "phone"
  | "city";

type FormStatus = "idle" | "loading" | "success" | "error";

const createInitialFormState = (): PreventivoFormState => ({
  squareMeters: "",
  floor: "",
  constructionYear: "",
  works: {
    bagni: false,
    numeroBagni: "",
    controsoffitto: false,
    mqControsoffitto: "",
    condizionatori: false,
    numeroCondizionatori: "",
    cucina: false,
    noteCucina: "",
  },
  plants: {
    elettrico: false,
    idraulico: false,
    gas: false,
    termoidraulico: false,
  },
  description: "",
  fullName: "",
  email: "",
  phone: "",
  city: "",
});

export default function Preventivo() {
  const [voci, setVoci] = useState<
    { id: string; voce: string; prezzo: string }[]
  >([]);
  const [formData, setFormData] = useState<PreventivoFormState>(
    createInitialFormState,
  );
  const [requestStatus, setRequestStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchVoci = async () => {
      const querySnapshot = await getDocs(collection(db, "preventivo"));
      setVoci(
        querySnapshot.docs.map((doc) => {
          const data = doc.data() as { voce: string; prezzo: string };
          return { id: doc.id, voce: data.voce, prezzo: data.prezzo };
        }),
      );
    };
    fetchVoci();
  }, []);

  const resetFeedback = () => {
    if (requestStatus !== "idle") {
      setRequestStatus("idle");
      setErrorMessage("");
    }
  };

  const handleFieldChange =
    (
      field: SimpleFieldKey,
    ): ((
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void) =>
    (event) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
      resetFeedback();
    };

  const toggleWork = (key: WorkToggleKey) => {
    setFormData((prev) => {
      const nextValue = !prev.works[key];
      const updatedWorks = {
        ...prev.works,
        [key]: nextValue,
      };

      if (!nextValue) {
        const detailKey = WORK_DETAIL_BY_TOGGLE[key];
        updatedWorks[detailKey] = "";
      }

      return { ...prev, works: updatedWorks };
    });
    resetFeedback();
  };

  const handleWorkDetailChange =
    (
      field: WorkDetailKey,
    ): ((
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void) =>
    (event) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        works: {
          ...prev.works,
          [field]: value,
        },
      }));
      resetFeedback();
    };

  const togglePlant = (key: PlantKey) => {
    setFormData((prev) => ({
      ...prev,
      plants: {
        ...prev.plants,
        [key]: !prev.plants[key],
      },
    }));
    resetFeedback();
  };

  const hasWorksSelection = WORK_TOGGLE_FIELDS.some(
    (field) => formData.works[field],
  );
  const showAnagrafica =
    Boolean(formData.squareMeters && formData.floor) && hasWorksSelection;
  const descriptionChars = formData.description.length;
  const isSubmitting = requestStatus === "loading";

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (!showAnagrafica) {
      setErrorMessage(
        "Compila i dati dell'immobile e seleziona almeno un'opera richiesta prima di procedere.",
      );
      setRequestStatus("error");
      return;
    }

    setRequestStatus("loading");
    setErrorMessage("");

    const worksSummary: string[] = [];
    if (formData.works.bagni) {
      worksSummary.push(
        `- Bagni: ${formData.works.numeroBagni.trim() || "numero non indicato"}`,
      );
    }
    if (formData.works.controsoffitto) {
      worksSummary.push(
        `- Controsoffitto: ${
          formData.works.mqControsoffitto.trim() || "metri quadri non indicati"
        }`,
      );
    }
    if (formData.works.condizionatori) {
      worksSummary.push(
        `- Condizionatori: ${
          formData.works.numeroCondizionatori.trim() || "quantitA  non indicata"
        }`,
      );
    }
    if (formData.works.cucina) {
      worksSummary.push(
        `- Cucina: ${
          formData.works.noteCucina.trim() || "nessuna nota fornita"
        }`,
      );
    }
    if (!worksSummary.length) {
      worksSummary.push("- Nessuna opera selezionata");
    }

    const plantsSummary = PLANTS_OPTIONS.filter(
      ({ key }) => formData.plants[key],
    ).map(({ label }) => `- ${label}`);

    if (!plantsSummary.length) {
      plantsSummary.push("- Nessun impianto selezionato");
    }

    const formattedLines = [
      "Richiesta preventivo dal sito:",
      "",
      "Dati dell'immobile:",
      `- Metri quadri totali: ${formData.squareMeters}`,
      `- Piano dell'immobile: ${formData.floor}`,
      `- Anno di costruzione: ${formData.constructionYear || "Non indicato"}`,
      "",
      "Opere richieste:",
      ...worksSummary,
      "",
      "Impianti desiderati:",
      ...plantsSummary,
      "",
      "Descrizione intervento:",
      formData.description.trim() || "Non indicata",
      "",
      "Dati anagrafici:",
      `- Nome e cognome: ${formData.fullName}`,
      `- Email: ${formData.email}`,
      `- Telefono: ${formData.phone || "Non fornito"}`,
      `- Comune immobile: ${formData.city}`,
    ];

    const readableMessage = formattedLines.join("\n");

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          squareMeters: formData.squareMeters,
          floor: formData.floor,
          constructionYear: formData.constructionYear,
          works: formData.works,
          plants: formData.plants,
          description: formData.description,
          message: readableMessage,
          body: readableMessage,
        }),
      });

      if (!response.ok) {
        throw new Error("Non siamo riusciti a inviare la richiesta.");
      }

      setRequestStatus("success");
      setFormData(createInitialFormState());
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Qualcosa A  andato storto. Riprova tra qualche minuto.";
      setErrorMessage(message);
      setRequestStatus("error");
    }
  };

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

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, ease: cubicBezier(0.22, 1, 0.36, 1) }}
        className="w-full px-4 pb-16 mt-12"
      >
        <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-[#e5e7eb] shadow-[0_20px_45px_rgba(11,21,46,0.08)] p-8">
          <span className="text-xs tracking-[0.3em] uppercase text-[#1E2A22]/70">
            Preventivo su misura
          </span>

          <h2 className="text-3xl font-semibold text-[#1E2A22] mt-2">
            Richiedi un preventivo professionale
          </h2>

          <p className="text-[#6b7280] mt-3">
            Inserisci i dati tecnici dell'immobile e raccontaci gli interventi
            che vuoi realizzare. Ti ricontatteremo con una proposta cucita sul
            tuo progetto.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            <div className="space-y-4">
              <p className="text-xs tracking-[0.35em] uppercase text-[#1E2A22]/60">
                Dati dell'immobile
              </p>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="squareMeters"
                    className="text-sm font-medium text-[#1E2A22]"
                  >
                    Metri quadri totali *
                  </label>

                  <input
                    id="squareMeters"
                    type="number"
                    min={30}
                    required
                    placeholder="Es. 120"
                    className="w-full border border-[#e5e7eb] rounded-xl px-4 py-3 text-[#1E2A22] focus:outline-none focus:ring-2 focus:ring-[#1E2A22]/40"
                    value={formData.squareMeters}
                    onChange={handleFieldChange("squareMeters")}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="floor"
                    className="text-sm font-medium text-[#1E2A22]"
                  >
                    Piano dell'immobile *
                  </label>

                  <input
                    id="floor"
                    type="number"
                    required
                    placeholder="Es. 2"
                    className="w-full border border-[#e5e7eb] rounded-xl px-4 py-3 text-[#1E2A22] focus:outline-none focus:ring-2 focus:ring-[#1E2A22]/40"
                    value={formData.floor}
                    onChange={handleFieldChange("floor")}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="constructionYear"
                    className="text-sm font-medium text-[#1E2A22]"
                  >
                    Anno di costruzione
                  </label>

                  <input
                    id="constructionYear"
                    type="number"
                    placeholder="Es. 1998"
                    className="w-full border border-[#e5e7eb] rounded-xl px-4 py-3 text-[#1E2A22] focus:outline-none focus:ring-2 focus:ring-[#1E2A22]/40"
                    value={formData.constructionYear}
                    onChange={handleFieldChange("constructionYear")}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs tracking-[0.35em] uppercase text-[#1E2A22]/60">
                Opere richieste
              </p>

              <div className="space-y-4">
                {WORKS_UI_CONFIG.map((work) => {
                  const detailKey = WORK_DETAIL_BY_TOGGLE[work.key];

                  const detailValue = formData.works[detailKey];

                  return (
                    <div
                      key={work.key}
                      className="rounded-2xl border border-[#e5e7eb] p-4 shadow-sm bg-[#fdfdfd]"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <label className="inline-flex items-center gap-3 text-[#1E2A22] font-semibold">
                          <input
                            type="checkbox"
                            className="w-4 h-4 accent-[#1E2A22]"
                            checked={formData.works[work.key]}
                            onChange={() => toggleWork(work.key)}
                          />

                          {work.label}
                        </label>

                        {formData.works[work.key] &&
                          (work.type === "textarea" ? (
                            <textarea
                              rows={3}
                              placeholder={work.placeholder}
                              className="w-full md:max-w-[320px] border border-[#e5e7eb] rounded-xl px-4 py-3 text-[#1E2A22] focus:outline-none focus:ring-2 focus:ring-[#1E2A22]/40"
                              value={detailValue}
                              onChange={handleWorkDetailChange(detailKey)}
                              required
                            />
                          ) : (
                            <input
                              type="number"
                              min={work.min}
                              placeholder={work.placeholder}
                              className="w-full md:max-w-[200px] border border-[#e5e7eb] rounded-xl px-4 py-3 text-[#1E2A22] focus:outline-none focus:ring-2 focus:ring-[#1E2A22]/40"
                              value={detailValue}
                              onChange={handleWorkDetailChange(detailKey)}
                              required
                            />
                          ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs tracking-[0.35em] uppercase text-[#1E2A22]/60">
                Impianti
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                {PLANTS_OPTIONS.map(({ key, label }) => (
                  <label
                    key={key}
                    className="flex items-center gap-3 border border-[#e5e7eb] rounded-2xl px-4 py-3 bg-[#f8fafc] hover:border-[#1E2A22]/40 transition"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-[#1E2A22]"
                      checked={formData.plants[key]}
                      onChange={() => togglePlant(key)}
                    />

                    <span className="text-sm font-medium text-[#1E2A22]">
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs tracking-[0.35em] uppercase text-[#1E2A22]/60">
                Altre informazioni
              </p>

              <textarea
                id="description"
                name="description"
                rows={6}
                maxLength={2000}
                required
                placeholder="Descrivi cosa vuoi realizzare, materiali preferiti, tempistiche o note aggiuntive."
                className="w-full border border-[#e5e7eb] rounded-2xl px-4 py-3 text-[#1E2A22] focus:outline-none focus:ring-2 focus:ring-[#1E2A22]/40"
                value={formData.description}
                onChange={handleFieldChange("description")}
              />

              <p className="text-xs text-[#6b7280] text-right">
                {descriptionChars}/2000
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-xs tracking-[0.35em] uppercase text-[#1E2A22]/60">
                Dati anagrafici
              </p>

              {showAnagrafica ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="fullName"
                      className="text-sm font-medium text-[#1E2A22]"
                    >
                      Nome e cognome *
                    </label>

                    <input
                      id="fullName"
                      type="text"
                      required
                      placeholder="Mario Rossi"
                      className="w-full border border-[#e5e7eb] rounded-xl px-4 py-3 text-[#1E2A22] focus:outline-none focus:ring-2 focus:ring-[#1E2A22]/40"
                      value={formData.fullName}
                      onChange={handleFieldChange("fullName")}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-[#1E2A22]"
                    >
                      Email *
                    </label>

                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="nome@email.com"
                      className="w-full border border-[#e5e7eb] rounded-xl px-4 py-3 text-[#1E2A22] focus:outline-none focus:ring-2 focus:ring-[#1E2A22]/40"
                      value={formData.email}
                      onChange={handleFieldChange("email")}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="phone"
                      className="text-sm font-medium text-[#1E2A22]"
                    >
                      Telefono
                    </label>

                    <input
                      id="phone"
                      type="tel"
                      inputMode="tel"
                      pattern="^[0-9+\s-]*$"
                      title="Sono ammessi solo numeri, spazi e i simboli + e -"
                      placeholder="+39 333 1234567"
                      className="w-full border border-[#e5e7eb] rounded-xl px-4 py-3 text-[#1E2A22] focus:outline-none focus:ring-2 focus:ring-[#1E2A22]/40"
                      value={formData.phone}
                      onChange={handleFieldChange("phone")}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="city"
                      className="text-sm font-medium text-[#1E2A22]"
                    >
                      Comune immobile *
                    </label>

                    <input
                      id="city"
                      type="text"
                      required
                      placeholder="Es. Milano"
                      className="w-full border border-[#e5e7eb] rounded-xl px-4 py-3 text-[#1E2A22] focus:outline-none focus:ring-2 focus:ring-[#1E2A22]/40"
                      value={formData.city}
                      onChange={handleFieldChange("city")}
                    />
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#cfd3dc] bg-[#f9fbff] p-4 text-sm text-[#1E2A22]">
                  Compila i dati dell'immobile e seleziona almeno un'opera per
                  inserire i tuoi riferimenti di contatto.
                </div>
              )}
            </div>

            {requestStatus === "error" && (
              <p
                className="text-sm text-red-600"
                role="alert"
                aria-live="assertive"
              >
                {errorMessage}
              </p>
            )}

            {requestStatus === "success" && (
              <p
                className="text-sm text-emerald-600"
                role="status"
                aria-live="polite"
              >
                Richiesta inviata correttamente. Ti ricontatteremo al piu
                presto.
              </p>
            )}

            <div className="space-y-2">
              <button
                type="submit"
                disabled={!showAnagrafica || isSubmitting}
                className="w-full bg-[#1E2A22] text-white font-semibold rounded-xl py-3 hover:bg-[#102046] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Invio in corso..." : "Richiedi preventivo"}
              </button>

              {!showAnagrafica && (
                <p className="text-xs text-[#6b7280] text-center">
                  Per inviare la richiesta indica metri quadri, piano e almeno
                  un'opera richiesta.
                </p>
              )}
            </div>
          </form>
        </div>
      </motion.section>

      <PreventivoFooter
        eyebrow="Hai domande sul preventivo?"
        title="Parla con un nostro tecnico"
        subtitle="Possiamo aiutarti a capire costi, fasi e tempistiche del tuo progetto."
        buttonText="Contattaci subito"
      />
    </main>
  );
}
