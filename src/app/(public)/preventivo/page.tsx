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

const PLANTS_OPTIONS = [
  { key: "elettrico", label: "Impianto elettrico" },
  { key: "idraulico", label: "Impianto idraulico" },
  { key: "gas", label: "Impianto gas" },
  { key: "termoidraulico", label: "Impianto termoidraulico" },
] as const;

type PlantKey = (typeof PLANTS_OPTIONS)[number]["key"];

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
  address: string;
};
type SimpleFieldKey =
  | "squareMeters"
  | "floor"
  | "constructionYear"
  | "description"
  | "fullName"
  | "email"
  | "phone"
  | "city"
  | "address";

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
  address: "",
});

export default function Preventivo() {
  const [voci, setVoci] = useState<
    {
      id: string;
      tipo: "opera" | "impianto";
      nome: string;
      dettaglio?: string;
      dettaglioTipo?: "text" | "number";
    }[]
  >([]);
  const [formData, setFormData] = useState<PreventivoFormState>(
    createInitialFormState,
  );
  const [requestStatus, setRequestStatus] = useState<FormStatus>("idle");
  // Chips autocomplete state
  const [selectedOpere, setSelectedOpere] = useState<string[]>([]);
  const [selectedImpianti, setSelectedImpianti] = useState<string[]>([]);
  const [chipInput, setChipInput] = useState("");
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Stato per i dettagli delle opere selezionate
  const [operaDetails, setOperaDetails] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchVoci = async () => {
      const querySnapshot = await getDocs(collection(db, "preventivo"));
      setVoci(
        querySnapshot.docs.map((doc) => {
          const data = doc.data() as {
            tipo?: "opera" | "impianto";
            nome?: string;
            voce?: string;
            dettaglio?: string;
            dettaglioTipo?: "text" | "number";
          };
          return {
            id: doc.id,
            tipo: data.tipo || "opera",
            nome: data.nome || data.voce || "",
            dettaglio: data.dettaglio || "",
            dettaglioTipo: data.dettaglioTipo || "text",
          };
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

  const showAnagrafica = Boolean(formData.squareMeters && formData.floor);
  const descriptionChars = formData.description.length;
  const isSubmitting = requestStatus === "loading";

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (!showAnagrafica) {
      setErrorMessage("Compila i dati dell'immobile prima di procedere.");
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
      `- Indirizzo: ${formData.address || "Non fornito"}`,
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
          address: formData.address,
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
            Richiedi un preventivo
          </h2>

          <p className="text-[#6b7280] mt-3">
            Inserisci i dati tecnici dell&rsquo;immobile e raccontaci gli
            interventi che vuoi realizzare. Ti ricontatteremo con una proposta
            cucita sul tuo progetto.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            <div className="space-y-4">
              <p className="text-xs tracking-[0.35em] uppercase text-[#1E2A22]/60">
                Dati dell&rsquo;immobile
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
                    Piano dell&rsquo;immobile *
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
              <div className="flex flex-row flex-wrap items-center border border-[#e5e7eb] rounded-xl px-3 py-2 bg-white min-h-[48px] gap-1">
                {/* Solo input di ricerca, senza chips */}
                <div
                  className="relative flex-1 min-w-[120px]"
                  style={{ minWidth: "120px", flexGrow: 1 }}
                >
                  <input
                    type="text"
                    value={chipInput || ""}
                    onChange={(e) => {
                      setChipInput(e.target.value);
                      setSuggestionsOpen(true);
                    }}
                    onFocus={() => setSuggestionsOpen(true)}
                    onBlur={() =>
                      setTimeout(() => setSuggestionsOpen(false), 150)
                    }
                    placeholder="Aggiungi opera o impianto..."
                    className="px-2 py-1 rounded border-none text-sm bg-white focus:outline-none w-full placeholder:text-[#444]"
                    style={{
                      minWidth: "80px",
                      flexGrow: 1,
                      background: "transparent",
                    }}
                  />
                  {suggestionsOpen && (
                    <div className="absolute left-0 top-full mt-1 w-full bg-white border border-[#e5e7eb] rounded-xl shadow-xl z-10">
                      {voci
                        .filter((item) => {
                          const isSelected =
                            item.tipo === "opera"
                              ? selectedOpere.includes(item.id)
                              : selectedImpianti.includes(item.id);
                          return (
                            !isSelected &&
                            (chipInput.trim() === "" ||
                              item.nome
                                .toLowerCase()
                                .includes(chipInput.toLowerCase()))
                          );
                        })
                        .map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            className="w-full text-left px-3 py-2 hover:bg-[#f5f6fa] text-[#1E2A22] text-sm"
                            onMouseDown={() => {
                              if (item.tipo === "opera")
                                setSelectedOpere([...selectedOpere, item.id]);
                              else
                                setSelectedImpianti([
                                  ...selectedImpianti,
                                  item.id,
                                ]);
                              setChipInput("");
                              setSuggestionsOpen(false);
                            }}
                          >
                            {item.tipo === "opera" ? "🛠️" : "⚡"} {item.nome}
                          </button>
                        ))}
                      {voci.filter((item) => {
                        const isSelected =
                          item.tipo === "opera"
                            ? selectedOpere.includes(item.id)
                            : selectedImpianti.includes(item.id);
                        return (
                          !isSelected &&
                          (chipInput.trim() === "" ||
                            item.nome
                              .toLowerCase()
                              .includes(chipInput.toLowerCase()))
                        );
                      }).length === 0 && (
                        <div className="px-3 py-2 text-[#6b7280] text-sm">
                          Nessuna voce trovata
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {/* Visualizza opere selezionate come quadrati (3 colonne), titolo centrato, con 'x' per rimuovere */}
              {selectedOpere.length === 0 && selectedImpianti.length === 0 ? (
                <div className="w-full text-center text-[#6b7280] py-8 text-base">
                  Nessuna voce selezionata
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {selectedOpere.map((id) => {
                      const opera = voci.find((v) => v.id === id);
                      if (!opera) return null;
                      return (
                        <div
                          key={opera.id}
                          className="rounded-xl border border-[#e5e7eb] p-4 shadow-sm bg-[#fdfdfd] flex flex-col h-full min-h-[170px] relative items-center"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedOpere(
                                selectedOpere.filter((oid) => oid !== id),
                              );
                              setOperaDetails((prev) => {
                                const copy = { ...prev };
                                delete copy[id];
                                return copy;
                              });
                            }}
                            className="absolute top-2 right-2 text-[#1E2A22] hover:text-red-400 focus:outline-none"
                            aria-label={`Rimuovi ${opera.nome}`}
                            style={{
                              fontWeight: "bold",
                              fontSize: "1.1em",
                              lineHeight: 1,
                            }}
                          >
                            ×
                          </button>
                          <div className="w-full flex flex-col items-center">
                            <span className="text-[#1E2A22] font-semibold mb-3 text-center w-full">
                              {opera.nome}
                            </span>
                            {opera.dettaglio && (
                              <div className="w-full flex flex-col items-center">
                                {opera.dettaglioTipo === "number" ? (
                                  <input
                                    type="number"
                                    className="border border-[#e5e7eb] rounded-lg px-2 py-1 w-full text-center text-[#1E2A22] placeholder:!text-[#444]"
                                    min={0}
                                    placeholder={opera.dettaglio}
                                    value={operaDetails[id] || ""}
                                    style={{ color: "#1E2A22" }}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setOperaDetails((prev) => ({
                                        ...prev,
                                        [id]: val,
                                      }));
                                    }}
                                  />
                                ) : (
                                  <textarea
                                    className="border border-[#e5e7eb] rounded-lg px-2 py-1 w-full text-center resize-none text-[#1E2A22] placeholder:!text-[#444]"
                                    rows={2}
                                    placeholder={opera.dettaglio}
                                    value={operaDetails[id] || ""}
                                    style={{ color: "#1E2A22" }}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setOperaDetails((prev) => ({
                                        ...prev,
                                        [id]: val,
                                      }));
                                    }}
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* Visualizza impianti selezionati come rettangoli sottili, stessa larghezza dei quadrati, con 'x' per rimuovere */}
                  {selectedImpianti.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      {selectedImpianti.map((id) => {
                        const impianto = voci.find((v) => v.id === id);
                        if (!impianto) return null;
                        return (
                          <div
                            key={impianto.id}
                            className="rounded-xl border border-[#e5e7eb] bg-[#f8fafc] px-4 py-2 flex items-center min-h-[40px] relative"
                          >
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedImpianti(
                                  selectedImpianti.filter((iid) => iid !== id),
                                )
                              }
                              className="absolute top-2 right-2 text-[#1E2A22] hover:text-red-400 focus:outline-none"
                              aria-label={`Rimuovi ${impianto.nome}`}
                              style={{
                                fontWeight: "bold",
                                fontSize: "1.1em",
                                lineHeight: 1,
                              }}
                            >
                              ×
                            </button>
                            <span className="text-[#1E2A22] text-sm font-medium">
                              ⚡ {impianto.nome}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}

              {/* Visualizza impianti selezionati come rettangoli sottili, stessa larghezza dei quadrati, con 'x' per rimuovere (unica visualizzazione) */}
            </div>

            {/* Sezione impianti rimossa, ora visualizzati sopra come chips e sotto come rettangoli sottili */}

            <div className="space-y-2">
              <p className="text-xs tracking-[0.35em] uppercase text-[#1E2A22]/60">
                Altre informazioni
              </p>

              <textarea
                id="description"
                name="description"
                rows={6}
                maxLength={2000}
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

                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label
                      htmlFor="address"
                      className="text-sm font-medium text-[#1E2A22]"
                    >
                      Indirizzo immobile *
                    </label>

                    <input
                      id="address"
                      type="text"
                      required
                      placeholder="Via, numero civico, CAP"
                      className="w-full border border-[#e5e7eb] rounded-xl px-4 py-3 text-[#1E2A22] focus:outline-none focus:ring-2 focus:ring-[#1E2A22]/40"
                      value={formData.address}
                      onChange={handleFieldChange("address")}
                    />
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#cfd3dc] bg-[#f9fbff] p-4 text-sm text-[#1E2A22]">
                  Indica i metri quadri e il piano dell&rsquo;immobile per
                  inserire i tuoi riferimenti
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
