"use client";

import React, { useEffect, useState } from "react";
import AdminMenu from "../components/AdminMenu";
import CategorieGestioneAdmin from "./CategorieGestioneAdmin";
// Componente portfolio admin già definito in questo file
import { MdEdit } from "react-icons/md";
import {
  onAuthStateChanged,
  signOut,
  User,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useRouter } from "next/navigation";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { db, storage } from "../../firebaseConfig";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import Image from "next/image";
import {
  FaEye,
  FaEyeSlash,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaTags,
  FaBriefcase,
  FaImage,
  FaLock,
  FaClipboardList,
} from "react-icons/fa";

// Colore blu scuro usato nella homepage
const bluScuro = "#1E2A22";
// UID autorizzato da Firebase Console (sostituisci con quello reale)

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("categorie");

  // --- HOMEPAGE HERO STATE ---
  const [heroImage, setHeroImage] = useState("");
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState<string>("");
  const [heroImagePosition, setHeroImagePosition] = useState(50); // percentuale verticale
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroLoading, setHeroLoading] = useState(false);
  const [heroSuccess, setHeroSuccess] = useState("");
  const [heroError, setHeroError] = useState("");

  // Carica dati hero da Firestore
  useEffect(() => {
    if (activeTab !== "homepage") return;
    setHeroLoading(true);
    setHeroError("");
    import("firebase/firestore").then(({ doc, getDoc }) => {
      getDoc(doc(db, "homepage", "hero"))
        .then((snap) => {
          if (snap.exists()) {
            const d = snap.data();
            setHeroImage(d.imageUrl || "");
            // Estrai la percentuale da object-position tipo "center 60%" oppure fallback 50
            let perc = 50;
            if (d.imagePosition && typeof d.imagePosition === "string") {
              const match = d.imagePosition.match(/center (\d+)%/);
              if (match) perc = parseInt(match[1], 10);
            }
            setHeroImagePosition(perc);
            setHeroTitle(d.titolo || "");
            setHeroSubtitle(d.sottotitolo || "");
          }
          setHeroLoading(false);
        })
        .catch(() => setHeroLoading(false));
    });
  }, [activeTab]);

  // Aggiorna anteprima immagine
  useEffect(() => {
    if (heroImageFile) {
      const reader = new FileReader();
      reader.onload = (e) => setHeroImagePreview(e.target?.result as string);
      reader.readAsDataURL(heroImageFile);
    } else {
      setHeroImagePreview("");
    }
  }, [heroImageFile]);

  // Salva dati hero su Firestore
  async function handleSaveHero(e: React.FormEvent) {
    e.preventDefault();
    setHeroLoading(true);
    setHeroSuccess("");
    setHeroError("");
    let imageUrl = heroImage;
    try {
      if (heroImageFile) {
        const storageRef = ref(storage, `homepage/hero/${heroImageFile.name}`);
        await uploadBytes(storageRef, heroImageFile);
        imageUrl = await getDownloadURL(storageRef);
      }
      await setDoc(doc(db, "homepage", "hero"), {
        imageUrl,
        imagePosition: `center ${heroImagePosition}%`,
        titolo: heroTitle,
        sottotitolo: heroSubtitle,
      });
      setHeroImage(imageUrl);
      setHeroSuccess("Salvato con successo!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Errore sconosciuto";
      setHeroError("Errore salvataggio: " + errorMessage);
    } finally {
      setHeroLoading(false);
    }
  }
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("admin.sidebar.collapsed");
      if (saved !== null) {
        setSidebarCollapsed(saved === "true");
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        "admin.sidebar.collapsed",
        String(sidebarCollapsed),
      );
    } catch {
      // ignore storage errors
    }
  }, [sidebarCollapsed]);

  // Logout automatico dopo 15 minuti di inattività
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const logout = async () => {
      await signOut(auth);
      router.push("/login");
    };
    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(logout, 15 * 60 * 1000); // 15 minuti
    };
    // Eventi che consideriamo "attività"
    const events = ["click", "keydown", "scroll", "mousemove", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();
    return () => {
      clearTimeout(timeoutId);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [router]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setCheckingAuth(false);
        router.push("/login");
        return;
      }
      setUser(currentUser);
      setCheckingAuth(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const adminSectionLabel: Record<string, string> = {
    categorie: "Gestione categorie",
    luoghi: "Gestione luoghi",
    portfolio: "Gestione portfolio",
    offerte: "Offerte",
    "cambia-password": "Cambia Password",
    preventivo: "Preventivo",
    homepage: "Homepage",
  };
  const isGestioneTab = ["categorie", "luoghi", "portfolio"].includes(
    activeTab,
  );
  const mobileTabMeta: Record<
    string,
    {
      label: string;
      icon: typeof FaTags;
    }
  > = {
    offerte: { label: "Offerte", icon: FaTags },
    portfolio: { label: "Portfolio", icon: FaBriefcase },
    homepage: { label: "Homepage", icon: FaImage },
    "cambia-password": { label: "Password", icon: FaLock },
    preventivo: { label: "Preventivo", icon: FaClipboardList },
  };
  const mobilePrimaryTabs = [
    { key: "offerte", ...mobileTabMeta.offerte },
    { key: "portfolio", ...mobileTabMeta.portfolio },
    { key: "homepage", ...mobileTabMeta.homepage },
    { key: "cambia-password", ...mobileTabMeta["cambia-password"] },
    { key: "preventivo", ...mobileTabMeta.preventivo },
  ];

  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-white flex flex-col items-center justify-center py-16 px-4 sm:px-8 font-sans">
        <p className="text-[#1E2A22] text-lg font-semibold">Caricamento…</p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bg-[#f6f8f7] font-sans min-h-screen sm:h-screen sm:overflow-hidden">
      {/* Sidebar desktop */}
      <div
        className={`hidden sm:block fixed left-0 top-0 h-screen z-20 transition-all duration-200 ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        <AdminMenu
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
        />
      </div>

      {/* Bottom nav mobile */}
      <div className="sm:hidden fixed bottom-3 left-3 right-3 z-30">
        <div className="rounded-2xl border border-[#dbe3de] bg-white/95 backdrop-blur shadow-lg px-2 py-1.5 flex items-center justify-between gap-1">
          {mobilePrimaryTabs.map((item) => {
            const active = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`flex-1 min-w-0 flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 transition-all ${
                  active
                    ? "bg-[#1E2A22] text-white"
                    : "text-[#4b5a52] hover:bg-[#f3f6f4]"
                }`}
              >
                <item.icon className="text-sm" />
                <span className="text-[11px] font-semibold truncate max-w-full">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <main
        className={`${sidebarCollapsed ? "sm:ml-20" : "sm:ml-64"} min-h-screen sm:h-screen flex flex-col items-center pt-8 sm:pt-6 pb-24 sm:pb-6 px-3 sm:px-8 transition-all duration-200 sm:overflow-hidden`}
      >
        <div className="w-full max-w-6xl flex flex-col gap-4 sm:gap-6 sm:h-full sm:min-h-0">
          <div className="bg-white rounded-2xl border border-[#e2e8e4] shadow-sm p-3 sm:p-6 sm:flex-1 sm:min-h-0 sm:overflow-hidden flex flex-col">
            <div className="mb-3 sm:mb-4 px-1 flex items-center justify-between gap-3">
              <h1 className="text-lg sm:text-xl font-bold text-[#1E2A22] tracking-tight">
                {adminSectionLabel[activeTab] || "Area Admin"}
              </h1>
              <div className="hidden lg:flex items-center gap-2 rounded-full bg-[#f3f6f4] px-2.5 py-1 border border-[#e2e8e4]">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-semibold text-[#38443c] max-w-[240px] truncate">
                  {user.email || "Admin"}
                </span>
              </div>
            </div>
            {isGestioneTab && (
              <div className="flex flex-wrap gap-2 mb-6 sm:mb-8 rounded-2xl bg-[#f5f7f6] border border-[#e2e8e4] p-2">
                <button
                  className={`px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 ${activeTab === "categorie" ? "bg-white text-[#1E2A22] shadow border border-[#dce4df]" : "text-[#4b5a52] hover:bg-white/70"}`}
                  onClick={() => setActiveTab("categorie")}
                >
                  Gestione categorie
                </button>
                <button
                  className={`px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 ${activeTab === "luoghi" ? "bg-white text-[#1E2A22] shadow border border-[#dce4df]" : "text-[#4b5a52] hover:bg-white/70"}`}
                  onClick={() => setActiveTab("luoghi")}
                >
                  Gestione luoghi
                </button>
                <button
                  className={`px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 ${activeTab === "portfolio" ? "bg-white text-[#1E2A22] shadow border border-[#dce4df]" : "text-[#4b5a52] hover:bg-white/70"}`}
                  onClick={() => setActiveTab("portfolio")}
                >
                  Gestione portfolio
                </button>
              </div>
            )}

            <div className="sm:flex-1 sm:min-h-0 sm:overflow-y-auto sm:pr-1">
              {activeTab === "categorie" && <CategorieGestioneAdmin />}
              {activeTab === "luoghi" && <LuoghiAdmin />}
              {activeTab === "portfolio" && (
                <PortfolioAdmin
                  onGoToCategorie={() => setActiveTab("categorie")}
                />
              )}
              {activeTab === "offerte" && <OfferteAdmin />}
              {activeTab === "cambia-password" && <CambiaPassword />}
              {activeTab === "preventivo" && <PreventivoAdmin />}
              {activeTab === "homepage" && (
                <section className="mb-8">
                  <div className="mb-6">
                    <h2
                      className="text-2xl font-extrabold"
                      style={{ color: bluScuro }}
                    >
                      Gestione Homepage
                    </h2>
                    <p className="text-sm text-[#5f6b63] mt-1">
                      Aggiorna contenuti e immagine hero della pagina
                      principale.
                    </p>
                  </div>
                  <form
                    onSubmit={handleSaveHero}
                    className="bg-white border border-[#e2e8e4] rounded-2xl p-6 sm:p-7 text-[#1E2A22] max-w-3xl mx-auto flex flex-col gap-5 shadow-sm"
                  >
                    {heroError && (
                      <div className="bg-red-50 text-red-700 rounded-lg p-3 text-sm font-semibold border border-red-200">
                        {heroError}
                      </div>
                    )}
                    {heroSuccess && (
                      <div className="bg-emerald-50 text-emerald-700 rounded-lg p-3 text-sm font-semibold border border-emerald-200">
                        {heroSuccess}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block font-semibold mb-1 text-[#1E2A22]">
                          Titolo Hero
                        </label>
                        <input
                          type="text"
                          value={heroTitle}
                          onChange={(e) => setHeroTitle(e.target.value)}
                          className="border border-[#d7dfda] rounded-lg px-3 py-2.5 w-full text-[#1E2A22] focus:outline-none focus:ring-2 focus:ring-[#1E2A22]/20"
                          placeholder="Titolo principale"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block font-semibold mb-1 text-[#1E2A22]">
                          Sottotitolo Hero
                        </label>
                        <textarea
                          value={heroSubtitle}
                          onChange={(e) => setHeroSubtitle(e.target.value)}
                          className="border border-[#d7dfda] rounded-lg px-3 py-2.5 w-full text-[#1E2A22] focus:outline-none focus:ring-2 focus:ring-[#1E2A22]/20"
                          rows={3}
                          placeholder="Testo descrittivo"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block font-semibold mb-1 text-[#1E2A22]">
                          Immagine Hero
                        </label>
                        <label className="inline-flex items-center gap-2 bg-[#1E2A22] text-white px-4 py-2.5 rounded-lg font-semibold cursor-pointer hover:bg-[#162019] transition-colors">
                          Scegli immagine
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              setHeroImageFile(e.target.files?.[0] || null)
                            }
                            className="hidden"
                          />
                        </label>
                        <div className="text-xs text-[#5f6b63] mt-2">
                          {heroImageFile
                            ? heroImageFile.name
                            : "Nessun nuovo file selezionato"}
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block font-semibold mb-1 text-[#1E2A22]">
                          Posizione verticale immagine ({heroImagePosition}%)
                        </label>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={heroImagePosition}
                          onChange={(e) =>
                            setHeroImagePosition(Number(e.target.value))
                          }
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="rounded-xl border border-[#d7dfda] bg-[#f8faf9] p-3">
                      <div className="text-xs text-[#5f6b63] mb-2">
                        Anteprima immagine
                      </div>
                      <div className="relative w-full h-56 rounded-lg overflow-hidden bg-gray-100">
                        {(heroImagePreview || heroImage) && (
                          <Image
                            src={heroImagePreview || heroImage}
                            alt="Anteprima hero"
                            fill
                            className="object-cover"
                            style={{
                              objectPosition: `center ${heroImagePosition}%`,
                            }}
                          />
                        )}
                        {!heroImagePreview && !heroImage && (
                          <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                            Nessuna immagine selezionata
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={heroLoading}
                      className="bg-[#1E2A22] text-white py-2.5 rounded-lg font-semibold hover:bg-[#162019] disabled:opacity-60"
                    >
                      {heroLoading ? "Salvataggio..." : "Salva homepage"}
                    </button>
                  </form>
                </section>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
  // Cambia Password Section (UI only, logic to be implemented)

  function CambiaPassword() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Get current user from Firebase Auth
    const user = auth.currentUser;

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setSuccess("");
      if (!user || !user.email) {
        setError("Utente non autenticato.");
        return;
      }
      if (!currentPassword || !newPassword || !confirmPassword) {
        setError("Compila tutti i campi.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setError("Le nuove password non coincidono.");
        return;
      }
      if (newPassword.length < 6) {
        setError("La nuova password deve essere di almeno 6 caratteri.");
        return;
      }
      setLoading(true);
      try {
        // Reautentica l'utente
        const credential = EmailAuthProvider.credential(
          user.email,
          currentPassword,
        );
        await reauthenticateWithCredential(user, credential);
        // Cambia la password
        await updatePassword(user, newPassword);
        setSuccess("Password cambiata con successo!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } catch (err) {
        const errorObj = err as { code?: string; message?: string };
        if (
          errorObj.code === "auth/wrong-password" ||
          errorObj.code === "auth/invalid-credential"
        ) {
          setError("La password attuale non è corretta.");
        } else if (errorObj.code === "auth/weak-password") {
          setError("La nuova password è troppo debole.");
        } else {
          setError(errorObj.message || "Errore durante il cambio password.");
        }
      } finally {
        setLoading(false);
      }
    };

    return (
      <section className="mb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold" style={{ color: "#1E2A22" }}>
            Cambia Password
          </h2>
          <p className="text-sm text-[#5f6b63] mt-1">
            Aggiorna in sicurezza la password dell&apos;account amministratore.
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#e2e8e4] rounded-2xl p-6 sm:p-7 text-[#1E2A22] max-w-lg mx-auto flex flex-col gap-4 shadow-sm"
        >
          {error && (
            <div className="bg-red-50 text-red-700 rounded-lg p-3 text-sm font-semibold border border-red-200">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-emerald-50 text-emerald-700 rounded-lg p-3 text-sm font-semibold border border-emerald-200">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block font-semibold mb-1 text-[#1E2A22]">
                Password attuale
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="border border-[#d7dfda] rounded-lg px-3 py-2.5 w-full text-[#1E2A22] focus:outline-none focus:ring-2 focus:ring-[#1E2A22]/20"
                autoComplete="current-password"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-[#1E2A22]">
                Nuova password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border border-[#d7dfda] rounded-lg px-3 py-2.5 w-full text-[#1E2A22] focus:outline-none focus:ring-2 focus:ring-[#1E2A22]/20"
                autoComplete="new-password"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-[#1E2A22]">
                Conferma nuova password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border border-[#d7dfda] rounded-lg px-3 py-2.5 w-full text-[#1E2A22] focus:outline-none focus:ring-2 focus:ring-[#1E2A22]/20"
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          <label
            htmlFor="showPassword"
            className="flex items-center gap-2 text-sm cursor-pointer text-[#1E2A22] select-none"
          >
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword((v) => !v)}
              className="h-4 w-4 rounded border-[#c4d0c9]"
            />
            Mostra password
          </label>

          <button
            type="submit"
            className="bg-[#1E2A22] text-white py-2.5 rounded-lg hover:bg-[#162019] font-semibold mt-1 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Salvataggio..." : "Cambia Password"}
          </button>
        </form>
      </section>
    );
  }
}

function OfferteAdmin() {
  const [addError, setAddError] = useState("");
  const [offerte, setOfferte] = useState<
    {
      id: string;
      titolo: string;
      descrizione: string;
      immagine: string;
      storagePath?: string;
      visibile: boolean;
    }[]
  >([]);
  const [titolo, setTitolo] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  // Stato per la modifica
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitolo, setEditTitolo] = useState("");
  const [editDescrizione, setEditDescrizione] = useState("");
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editImmagine, setEditImmagine] = useState<string>("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchOfferte = async () => {
      const querySnapshot = await getDocs(collection(db, "offerte"));
      setOfferte(
        querySnapshot.docs.map((doc) => {
          const data = doc.data() as {
            titolo: string;
            descrizione: string;
            immagine: string;
            storagePath?: string;
            visibile?: boolean;
          };
          return {
            id: doc.id,
            titolo: data.titolo,
            descrizione: data.descrizione,
            immagine: data.immagine,
            storagePath: data.storagePath || "",
            visibile: data.visibile !== false,
          };
        }),
      );
    };
    fetchOfferte();
  }, []);

  // Quando si clicca Modifica, precompila i campi
  useEffect(() => {
    if (editId) {
      const offerta = offerte.find((o) => o.id === editId);
      if (offerta) {
        // Aggiorno lo stato solo se diverso, per evitare warning React
        if (editTitolo !== offerta.titolo) setEditTitolo(offerta.titolo);
        if (editDescrizione !== offerta.descrizione)
          setEditDescrizione(offerta.descrizione);
        if (editImmagine !== offerta.immagine)
          setEditImmagine(offerta.immagine);
        setEditFile(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId, offerte]);

  const toggleVisibilita = async (id: string, visibile: boolean) => {
    await setDoc(
      doc(db, "offerte", id),
      { visibile: !visibile },
      { merge: true },
    );
    setOfferte((prev) =>
      prev.map((o) => (o.id === id ? { ...o, visibile: !visibile } : o)),
    );
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");
    if (!file) {
      setAddError("Seleziona un'immagine per l'offerta.");
      setLoading(false);
      return;
    }
    setLoading(true);
    let imageUrl = "";
    let storagePath = "";
    try {
      const storageRef = ref(storage, `offerte/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      imageUrl = await getDownloadURL(storageRef);
      storagePath = storageRef.fullPath;
    } catch {
      imageUrl = "";
      storagePath = "";
    }
    await addDoc(collection(db, "offerte"), {
      titolo,
      descrizione,
      immagine: imageUrl,
      storagePath,
      visibile: true,
    });
    setTitolo("");
    setDescrizione("");
    setFile(null);
    setShowForm(false);
    const querySnapshot = await getDocs(collection(db, "offerte"));
    setOfferte(
      querySnapshot.docs.map((doc) => {
        const data = doc.data() as {
          titolo: string;
          descrizione: string;
          immagine: string;
          storagePath?: string;
          visibile?: boolean;
        };
        return {
          id: doc.id,
          titolo: data.titolo,
          descrizione: data.descrizione,
          immagine: data.immagine,
          storagePath: data.storagePath || "",
          visibile: data.visibile !== false,
        };
      }),
    );
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    setDeleteLoading(true);
    const offerta = offerte.find((o) => o.id === id);
    if (offerta && offerta.storagePath) {
      try {
        const imageRef = ref(storage, offerta.storagePath);
        await deleteObject(imageRef);
      } catch {
        // errore, ignora
      }
    }
    await deleteDoc(doc(db, "offerte", id));
    setOfferte(offerte.filter((o) => o.id !== id));
    setDeleteId(null);
    setDeleteLoading(false);
  };

  // Funzione per modificare l'offerta
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    let imageUrl = editImmagine;
    if (editFile) {
      try {
        const storageRef = ref(
          storage,
          `offerte/${Date.now()}_${editFile.name}`,
        );
        await uploadBytes(storageRef, editFile);
        imageUrl = await getDownloadURL(storageRef);
      } catch {
        // errore upload, mantieni immagine precedente
      }
    }
    await setDoc(
      doc(db, "offerte", editId),
      {
        titolo: editTitolo,
        descrizione: editDescrizione,
        immagine: imageUrl,
      },
      { merge: true },
    );
    setEditId(null);
    // Aggiorna la lista offerte
    const querySnapshot = await getDocs(collection(db, "offerte"));
    setOfferte(
      querySnapshot.docs.map((doc) => {
        const data = doc.data() as {
          titolo: string;
          descrizione: string;
          immagine: string;
          storagePath?: string;
          visibile?: boolean;
        };
        return {
          id: doc.id,
          titolo: data.titolo,
          descrizione: data.descrizione,
          immagine: data.immagine,
          storagePath: data.storagePath || "",
          visibile: data.visibile !== false,
        };
      }),
    );
  };

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-2xl font-extrabold" style={{ color: bluScuro }}>
            Offerte disponibili
          </h2>
          <p className="text-sm text-[#5f6b63] mt-1">
            Gestisci visibilità, contenuti e immagini delle offerte.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#1E2A22] hover:bg-[#162019] text-white rounded-xl px-4 h-11 flex items-center justify-center shadow text-lg font-semibold"
          title="Aggiungi offerta"
        >
          <span className="font-bold mr-1">+</span> Nuova
        </button>
      </div>
      {/* POPUP INSERIMENTO OFFERTA */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center px-3">
          <form
            onSubmit={handleAdd}
            className="bg-white rounded-2xl border border-[#e2e8e4] shadow-xl p-6 sm:p-8 w-full max-w-lg flex flex-col gap-4 relative"
          >
            {addError && (
              <div className="bg-red-100 text-red-700 rounded p-2 text-base font-bold border border-red-300 mb-4 text-center animate-pulse shadow">
                {addError}
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
              title="Chiudi"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold pr-8" style={{ color: bluScuro }}>
              Aggiungi Offerta
            </h3>
            <input
              type="text"
              placeholder="Titolo"
              value={titolo}
              onChange={(e) => setTitolo(e.target.value)}
              className="border rounded px-3 py-2 placeholder-gray-500 text-black"
              required
            />
            <textarea
              placeholder="Descrizione"
              value={descrizione}
              onChange={(e) => setDescrizione(e.target.value)}
              className="border rounded px-3 py-2 placeholder-gray-500 text-black"
            />
            <div className="flex flex-col items-center gap-2">
              {file ? (
                <Image
                  src={URL.createObjectURL(file)}
                  alt="Anteprima"
                  width={128}
                  height={128}
                  className="object-cover rounded border"
                />
              ) : (
                <div className="w-32 h-32 flex items-center justify-center bg-gray-200 text-gray-500 rounded border text-center text-xs">
                  IMMAGINE NON DISPONIBILE
                </div>
              )}
              <label
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow cursor-pointer mt-2"
                style={{ backgroundColor: bluScuro }}
              >
                Scegli immagine
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setFile(e.target.files?.[0] || null);
                    if (e.target.files?.[0]) setAddError("");
                  }}
                  className="hidden"
                />
              </label>
            </div>
            <div className="flex gap-2 mt-1">
              <button
                type="submit"
                className="bg-[#1E2A22] text-white py-2 px-5 rounded-lg hover:bg-[#162019] transition-colors font-semibold"
                disabled={loading}
              >
                {loading ? "Salvataggio..." : "Salva Offerta"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-200 text-[#1E2A22] py-2 px-5 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Annulla
              </button>
            </div>
          </form>
        </div>
      )}
      {offerte.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#d1d9d3] bg-[#f8faf9] p-8 text-center text-[#5f6b63]">
          Nessuna offerta presente. Usa “Nuova” per aggiungere la prima offerta.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offerte.map((o) => (
            <div
              key={o.id}
              className="relative group rounded-2xl overflow-hidden shadow-sm border border-[#dbe3de] bg-white flex flex-col h-full"
            >
              {/* Badge visibile se nascosta */}
              {!o.visibile && (
                <div className="absolute top-2 left-2 bg-red-600/90 text-white text-xs font-bold px-3 py-1 rounded-full shadow z-10 flex items-center gap-1">
                  <FaEyeSlash className="inline-block text-white text-base" />
                  Nascosta
                </div>
              )}
              <div className="relative">
                <Image
                  src={o.immagine || "/placeholder.jpg"}
                  alt={o.titolo}
                  width={600}
                  height={300}
                  className={`object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105 ${
                    !o.visibile ? "grayscale-[0.7] brightness-75" : ""
                  }`}
                  style={
                    o.visibile
                      ? {}
                      : { filter: "grayscale(0.7) brightness(0.7)" }
                  }
                />
                {/* Azioni sempre visibili su mobile, overlay su desktop */}
                {/* Mobile: titolo e azioni sempre visibili sotto immagine */}
                <div className="sm:hidden text-center pb-2">
                  <div className="font-bold text-base truncate max-w-[90%] mx-auto text-[#1E2A22]">
                    {o.titolo}
                  </div>
                </div>
                <div className="flex sm:hidden justify-center gap-3 py-2 bg-white/90">
                  <button
                    onClick={() => toggleVisibilita(o.id, o.visibile)}
                    className={`rounded-full bg-green-100 hover:bg-green-200 p-2 shadow text-xl transition ${
                      o.visibile ? "text-green-600" : "text-gray-400"
                    }`}
                    title={o.visibile ? "Nascondi dal sito" : "Mostra sul sito"}
                  >
                    {o.visibile ? <FaEye /> : <FaEyeSlash />}
                  </button>
                  <button
                    onClick={() => setEditId(o.id)}
                    className="rounded-full bg-blue-100 hover:bg-blue-200 p-2 shadow text-[#1E2A22] text-xl transition"
                    title="Modifica"
                  >
                    <MdEdit />
                  </button>
                  <button
                    onClick={() => setDeleteId(o.id)}
                    className="rounded-full bg-red-100 hover:bg-red-200 p-2 shadow text-red-600 text-xl transition"
                    title="Elimina"
                  >
                    <FaTrash />
                  </button>
                </div>
                {/* Desktop: overlay su hover */}
                <div className="hidden sm:flex absolute inset-0 bg-black/60 flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-white text-center px-4">
                    <div className="font-bold text-lg truncate max-w-[90%] mx-auto">
                      {o.titolo}
                    </div>
                    <div className="text-base mt-2 whitespace-pre-line break-words">
                      {o.descrizione}
                    </div>
                  </div>
                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={() => toggleVisibilita(o.id, o.visibile)}
                      className={`rounded-full bg-white/90 hover:bg-green-100 p-2 shadow text-xl transition ${
                        o.visibile ? "text-green-600" : "text-gray-400"
                      }`}
                      title={
                        o.visibile ? "Nascondi dal sito" : "Mostra sul sito"
                      }
                    >
                      {o.visibile ? <FaEye /> : <FaEyeSlash />}
                    </button>
                    <button
                      onClick={() => setEditId(o.id)}
                      className="rounded-full bg-white/90 hover:bg-blue-100 p-2 shadow text-[#1E2A22] text-xl transition"
                      title="Modifica"
                    >
                      <MdEdit />
                    </button>
                    <button
                      onClick={() => setDeleteId(o.id)}
                      className="rounded-full bg-white/90 hover:bg-red-100 p-2 shadow text-red-600 text-xl transition"
                      title="Elimina"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* POPUP CONFERMA ELIMINAZIONE */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center px-3">
          <div className="bg-white rounded-2xl border border-[#e2e8e4] shadow-xl p-6 w-full max-w-sm flex flex-col gap-4 relative">
            <h3 className="text-xl font-bold text-[#1E2A22] mb-2">
              Conferma eliminazione
            </h3>
            <p className="text-[#3a4a5a]">
              Sei sicuro di voler eliminare questa offerta? L&apos;immagine
              collegata verrà rimossa dallo storage.
            </p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleDelete(deleteId)}
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 font-semibold"
                disabled={deleteLoading}
              >
                {deleteLoading ? "Eliminazione..." : "Elimina"}
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="bg-gray-200 text-[#1E2A22] py-2 px-4 rounded-lg hover:bg-gray-300 font-semibold"
                disabled={deleteLoading}
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}
      {/* MODAL MODIFICA OFFERTA */}
      {editId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center px-3">
          <form
            onSubmit={handleEdit}
            className="bg-white rounded-2xl border border-[#e2e8e4] shadow-xl p-6 sm:p-8 w-full max-w-lg flex flex-col gap-4 relative"
          >
            <button
              type="button"
              onClick={() => setEditId(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
              title="Chiudi"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold pr-8" style={{ color: bluScuro }}>
              Modifica Offerta
            </h3>
            <input
              type="text"
              placeholder="Titolo"
              value={editTitolo}
              onChange={(e) => setEditTitolo(e.target.value)}
              className="border rounded px-3 py-2 placeholder-gray-500 text-black"
              required
            />
            <textarea
              placeholder="Descrizione"
              value={editDescrizione}
              onChange={(e) => setEditDescrizione(e.target.value)}
              className="border rounded px-3 py-2 placeholder-gray-500 text-black"
              required
            />
            <div className="flex flex-col items-center gap-2">
              {editFile ? (
                <Image
                  src={URL.createObjectURL(editFile)}
                  alt="Anteprima"
                  width={128}
                  height={128}
                  className="object-cover rounded border"
                />
              ) : editImmagine ? (
                <Image
                  src={editImmagine}
                  alt="Immagine offerta"
                  width={128}
                  height={128}
                  className="object-cover rounded border"
                />
              ) : (
                <div className="w-32 h-32 flex items-center justify-center bg-gray-200 text-gray-500 rounded border text-center text-xs">
                  IMMAGINE NON DISPONIBILE
                </div>
              )}
              <label
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow cursor-pointer mt-2"
                style={{ backgroundColor: bluScuro }}
              >
                Scegli immagine
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                className="bg-[#1E2A22] text-white py-2 px-5 rounded-lg hover:bg-[#162019] font-semibold"
                style={{ backgroundColor: bluScuro }}
              >
                Salva modifiche
              </button>
              <button
                type="button"
                onClick={() => setEditId(null)}
                className="bg-gray-200 text-[#1E2A22] py-2 px-5 rounded-lg hover:bg-gray-300 font-semibold"
              >
                Annulla
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

function LuoghiAdmin() {
  const [luoghi, setLuoghi] = useState<{ id: string; nome: string }[]>([]);
  const [newLuogo, setNewLuogo] = useState("");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editNome, setEditNome] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const fetchLuoghi = async () => {
    const snap = await getDocs(collection(db, "luoghi"));
    setLuoghi(
      snap.docs
        .map((doc) => ({ id: doc.id, nome: (doc.data().nome || "").trim() }))
        .filter((l) => l.nome),
    );
  };

  useEffect(() => {
    fetchLuoghi();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const nome = newLuogo.trim();
    if (!nome) return;
    if (luoghi.some((l) => l.nome.toLowerCase() === nome.toLowerCase())) {
      setNewLuogo("");
      return;
    }
    setLoading(true);
    await addDoc(collection(db, "luoghi"), { nome });
    setNewLuogo("");
    await fetchLuoghi();
    setLoading(false);
  };

  const handleSaveEdit = async (id: string) => {
    const nome = editNome.trim();
    if (!nome) return;
    if (
      luoghi.some(
        (l) => l.id !== id && l.nome.toLowerCase() === nome.toLowerCase(),
      )
    ) {
      setEditId(null);
      setEditNome("");
      return;
    }
    setLoading(true);
    await setDoc(doc(db, "luoghi", id), { nome }, { merge: true });
    setEditId(null);
    setEditNome("");
    await fetchLuoghi();
    setLoading(false);
  };

  const getLuogoUsageCount = async (nomeLuogo: string) => {
    const normalizedLuogo = nomeLuogo.trim().toLowerCase();
    if (!normalizedLuogo) return 0;

    const portfolioSnap = await getDocs(collection(db, "portfolio"));
    return portfolioSnap.docs.reduce((count, portfolioDoc) => {
      const luogoPortfolio = ((portfolioDoc.data().luogo as string) || "")
        .trim()
        .toLowerCase();
      return luogoPortfolio === normalizedLuogo ? count + 1 : count;
    }, 0);
  };

  const handleDelete = async (id: string, nome: string) => {
    setDeleteError("");
    setLoading(true);
    try {
      const usageCount = await getLuogoUsageCount(nome);
      if (usageCount > 0) {
        setDeleteError(
          `Non puoi eliminare "${nome}" perché è usato in ${usageCount} ${usageCount === 1 ? "lavoro" : "lavori"} del portfolio.`,
        );
        return;
      }

      await deleteDoc(doc(db, "luoghi", id));
      await fetchLuoghi();
    } finally {
      setLoading(false);
    }
  };

  const luoghiFiltrati = luoghi
    .filter((l) => l.nome.toLowerCase().includes(search.trim().toLowerCase()))
    .sort((a, b) => a.nome.localeCompare(b.nome, "it"));

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-extrabold" style={{ color: bluScuro }}>
          Gestione luoghi
        </h2>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newLuogo}
          onChange={(e) => setNewLuogo(e.target.value)}
          placeholder="Nuovo luogo"
          className="border rounded px-3 py-2 text-black flex-1"
        />
        <button
          type="submit"
          disabled={loading || !newLuogo.trim()}
          className="bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500"
        >
          Aggiungi
        </button>
      </form>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Cerca luogo..."
        className="border rounded px-3 py-2 text-black w-full mb-3"
      />
      {deleteError && (
        <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
          {deleteError}
        </div>
      )}
      <div className="text-xs text-gray-500 mb-2">
        {luoghiFiltrati.length}{" "}
        {luoghiFiltrati.length === 1 ? "luogo" : "luoghi"}
      </div>

      <div className="space-y-2 pr-1">
        {luoghiFiltrati.length === 0 ? (
          <div className="text-sm text-gray-500">Nessun luogo censito.</div>
        ) : (
          luoghiFiltrati.map((luogo) => (
            <div
              key={luogo.id}
              className="flex items-center gap-2 border rounded-lg px-3 py-2"
            >
              {editId === luogo.id ? (
                <>
                  <input
                    type="text"
                    value={editNome}
                    onChange={(e) => setEditNome(e.target.value)}
                    className="border rounded px-3 py-2 text-black flex-1"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveEdit(luogo.id)}
                    className="bg-green-600 text-white px-3 py-2 rounded font-semibold hover:bg-green-700"
                  >
                    Salva
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditId(null);
                      setEditNome("");
                    }}
                    className="bg-gray-400 text-white px-3 py-2 rounded font-semibold hover:bg-gray-500"
                  >
                    Annulla
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-[#1E2A22] font-medium">
                    {luogo.nome}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setEditId(luogo.id);
                      setEditNome(luogo.nome);
                    }}
                    className="bg-blue-600 text-white px-3 py-2 rounded font-semibold hover:bg-blue-700"
                  >
                    Modifica
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(luogo.id, luogo.nome)}
                    disabled={loading}
                    className="bg-red-600 text-white px-3 py-2 rounded font-semibold hover:bg-red-700 disabled:bg-gray-300 disabled:text-gray-500"
                  >
                    Elimina
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function PortfolioAdmin({ onGoToCategorie }: { onGoToCategorie: () => void }) {
  const [addError, setAddError] = useState("");
  const [items, setItems] = useState<
    {
      id: string;
      titolo: string;
      immagine: string;
      macro?: string;
      categoria: string;
      descrizione?: string;
      luogo?: string;
      storagePath?: string;
      visibile: boolean;
    }[]
  >([]);
  const [titolo, setTitolo] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [luogo, setLuogo] = useState("");
  const [macro, setMacro] = useState("");
  const [categoria, setCategoria] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("TUTTE");
  const [file, setFile] = useState<File | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [categorie, setCategorie] = useState<string[]>([]);
  const [macros, setMacros] = useState<string[]>([]);
  const [categories, setCategories] = useState<
    { nome: string; macro: string }[]
  >([]);
  const [luoghiCatalogo, setLuoghiCatalogo] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingLuogo, setSavingLuogo] = useState(false);
  const [showAddLuoghiDropdown, setShowAddLuoghiDropdown] = useState(false);
  const [showEditLuoghiDropdown, setShowEditLuoghiDropdown] = useState(false);
  // rimosso duplicato addError
  const [editId, setEditId] = useState<string | null>(null);
  const [editMacro, setEditMacro] = useState("");
  const [editTitolo, setEditTitolo] = useState("");
  const [editDescrizione, setEditDescrizione] = useState("");
  const [editLuogo, setEditLuogo] = useState("");
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editImmagine, setEditImmagine] = useState<string>("");
  const [editCategoria, setEditCategoria] = useState("");
  const [showCategorie, setShowCategorie] = useState(false);
  const [editCategorie, setEditCategorie] = useState<string[]>([]);
  const [categoriaDaEliminare, setCategoriaDaEliminare] = useState<
    string | null
  >(null);
  const [lavoriInCategoria, setLavoriInCategoria] = useState<number>(0);
  const [showConfermaEliminaCat, setShowConfermaEliminaCat] = useState(false);
  // AGGIUNTA: Stato per popup conferma eliminazione portfolio
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  // PAGINAZIONE MOBILE
  const [pageMobile, setPageMobile] = useState(1);

  useEffect(() => {
    // Carica portfolio
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, "portfolio"));
      setItems(
        querySnapshot.docs
          .map((doc) => {
            const data = doc.data() as {
              titolo: string;
              immagine: string;
              macro?: string;
              categoria: string;
              descrizione?: string;
              luogo?: string;
              storagePath?: string;
              visibile?: boolean;
              createdAt?: number;
            };
            return {
              id: doc.id,
              titolo: data.titolo,
              immagine: data.immagine,
              macro: data.macro || "",
              categoria: data.categoria,
              descrizione: data.descrizione || "",
              luogo: data.luogo || "",
              storagePath: data.storagePath || "",
              visibile: data.visibile !== false,
              createdAt: data.createdAt || 0,
            };
          })
          .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)),
      );
    };
    // Carica categorie
    const fetchCategorie = async () => {
      const querySnapshot = await getDocs(collection(db, "categorie"));
      setCategorie(querySnapshot.docs.map((doc) => doc.data().nome));
    };
    const fetchMacros = async () => {
      const querySnapshot = await getDocs(collection(db, "macrocategorie"));
      setMacros(querySnapshot.docs.map((doc) => doc.data().nome));
    };
    const fetchCategoriesByMacro = async () => {
      const querySnapshot = await getDocs(collection(db, "categorie"));
      setCategories(
        querySnapshot.docs.map((doc) => ({
          nome: doc.data().nome,
          macro: doc.data().macro,
        })),
      );
    };
    const fetchLuoghiCatalogo = async () => {
      const querySnapshot = await getDocs(collection(db, "luoghi"));
      setLuoghiCatalogo(
        querySnapshot.docs
          .map((doc) => (doc.data().nome || "").trim())
          .filter((nome) => nome.length > 0),
      );
    };
    fetchItems();
    fetchCategorie();
    fetchMacros();
    fetchCategoriesByMacro();
    fetchLuoghiCatalogo();
  }, []);

  // FIX: editCategorie deve essere sincronizzato con categorie quando si apre il popup
  useEffect(() => {
    if (showCategorie) {
      setEditCategorie(categorie);
    }
  }, [showCategorie, categorie]);

  useEffect(() => {
    setEditCategoria(categoria);
  }, [categoria]);

  // Modifica lavoro
  useEffect(() => {
    if (editId) {
      const item = items.find((i) => i.id === editId);
      if (item) {
        setEditMacro(item.macro || "");
        setEditTitolo(item.titolo);
        setEditDescrizione(item.descrizione || "");
        setEditLuogo(item.luogo || "");
        setEditImmagine(item.immagine);
        setEditCategoria(item.categoria);
        setEditFile(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId]);

  const toggleVisibilita = async (id: string, visibile: boolean) => {
    await setDoc(
      doc(db, "portfolio", id),
      { visibile: !visibile },
      { merge: true },
    );
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, visibile: !visibile } : i)),
    );
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");
    if (!titolo.trim()) {
      setAddError("Inserisci un titolo.");
      setLoading(false);
      return;
    }
    if (!macro) {
      setAddError("Seleziona una macrocategoria.");
      setLoading(false);
      return;
    }
    if (!categories.some((c) => c.macro === macro)) {
      setAddError(
        "La macrocategoria selezionata non ha categorie. Creane una prima di salvare.",
      );
      setLoading(false);
      return;
    }
    if (!categoria) {
      setAddError("Seleziona una categoria.");
      setLoading(false);
      return;
    }
    if (!file) {
      setAddError("Seleziona un'immagine per il portfolio.");
      setLoading(false);
      return;
    }
    setLoading(true);
    let imageUrl = "";
    let storagePath = "";
    try {
      const storageRef = ref(storage, `portfolio/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      imageUrl = await getDownloadURL(storageRef);
      storagePath = storageRef.fullPath;
    } catch (err) {
      console.error("Errore upload immagine portfolio:", err);
      setAddError(
        err instanceof Error && err.message
          ? `Errore durante il caricamento: ${err.message}`
          : "Errore durante il caricamento dell'immagine. Riprova.",
      );
      setLoading(false);
      return;
    }
    if (!imageUrl) {
      setAddError("Impossibile ottenere l'URL dell'immagine. Riprova.");
      setLoading(false);
      return;
    }
    await addDoc(collection(db, "portfolio"), {
      titolo,
      descrizione,
      luogo,
      macro,
      immagine: imageUrl,
      categoria,
      storagePath,
      visibile: true,
      createdAt: Date.now(),
    });
    setTitolo("");
    setDescrizione("");
    setLuogo("");
    setShowAddLuoghiDropdown(false);
    setMacro("");
    setCategoria("");
    setFile(null);
    setShowForm(false);
    const querySnapshot = await getDocs(collection(db, "portfolio"));
    setItems(
      querySnapshot.docs
        .map((doc) => {
          const data = doc.data() as {
            titolo: string;
            immagine: string;
            macro?: string;
            categoria: string;
            descrizione?: string;
            luogo?: string;
            storagePath?: string;
            visibile?: boolean;
            createdAt?: number;
          };
          return {
            id: doc.id,
            titolo: data.titolo,
            immagine: data.immagine,
            macro: data.macro || "",
            categoria: data.categoria,
            descrizione: data.descrizione || "",
            luogo: data.luogo || "",
            storagePath: data.storagePath || "",
            visibile: data.visibile !== false,
            createdAt: data.createdAt || 0,
          };
        })
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)),
    );
    setLoading(false);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    if (!editTitolo.trim()) return;
    if (!editMacro) return;
    if (!categories.some((c) => c.macro === editMacro)) return;
    if (!editCategoria) return;
    let imageUrl = editImmagine;
    let storagePath = "";
    if (editFile) {
      try {
        const storageRef = ref(
          storage,
          `portfolio/${Date.now()}_${editFile.name}`,
        );
        await uploadBytes(storageRef, editFile);
        imageUrl = await getDownloadURL(storageRef);
        storagePath = storageRef.fullPath;
      } catch {
        // errore upload, mantieni immagine precedente
      }
    }
    await setDoc(
      doc(db, "portfolio", editId),
      {
        macro: editMacro,
        titolo: editTitolo,
        descrizione: editDescrizione,
        luogo: editLuogo,
        immagine: imageUrl,
        categoria: editCategoria,
        ...(storagePath ? { storagePath } : {}),
      },
      { merge: true },
    );
    setEditId(null);
    // Aggiorna lista
    const querySnapshot = await getDocs(collection(db, "portfolio"));
    setItems(
      querySnapshot.docs
        .map((doc) => {
          const data = doc.data() as {
            titolo: string;
            immagine: string;
            macro?: string;
            categoria: string;
            descrizione?: string;
            luogo?: string;
            storagePath?: string;
            visibile?: boolean;
            createdAt?: number;
          };
          return {
            id: doc.id,
            titolo: data.titolo,
            immagine: data.immagine,
            macro: data.macro || "",
            categoria: data.categoria,
            descrizione: data.descrizione || "",
            luogo: data.luogo || "",
            storagePath: data.storagePath || "",
            visibile: data.visibile !== false,
            createdAt: data.createdAt || 0,
          };
        })
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)),
    );
  };

  const handleDelete = async (id: string) => {
    setDeleteLoading(true);
    const item = items.find((i) => i.id === id);
    if (item && item.storagePath) {
      try {
        const imageRef = ref(storage, item.storagePath);
        await deleteObject(imageRef);
      } catch {}
    }
    await deleteDoc(doc(db, "portfolio", id));
    setItems(items.filter((i) => i.id !== id));
    setDeleteId(null);
    setDeleteLoading(false);
  };

  // Gestione categorie
  const handleCategorieEdit = async () => {
    // Elimina tutte le categorie su Firebase
    const querySnapshot = await getDocs(collection(db, "categorie"));
    for (const docSnap of querySnapshot.docs) {
      await deleteDoc(doc(db, "categorie", docSnap.id));
    }
    // Prendi solo categorie uniche e non vuote
    const uniqueCategorie = Array.from(
      new Set(editCategorie.map((c) => c.trim()).filter((c) => c)),
    );
    for (const nome of uniqueCategorie) {
      await addDoc(collection(db, "categorie"), { nome });
    }
    setCategorie(uniqueCategorie);
    setShowCategorie(false);
    // Aggiorna la lista lavori
    const newSnapshot = await getDocs(collection(db, "portfolio"));
    setItems(
      newSnapshot.docs
        .map((doc) => {
          const data = doc.data() as {
            titolo: string;
            immagine: string;
            macro?: string;
            categoria: string;
            descrizione?: string;
            luogo?: string;
            storagePath?: string;
            visibile?: boolean;
            createdAt?: number;
          };
          return {
            id: doc.id,
            titolo: data.titolo,
            immagine: data.immagine,
            macro: data.macro || "",
            categoria: data.categoria,
            descrizione: data.descrizione || "",
            luogo: data.luogo || "",
            storagePath: data.storagePath || "",
            visibile: data.visibile !== false,
            createdAt: data.createdAt || 0,
          };
        })
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)),
    );
  };

  const handleRemoveCategoria = async (idx: number) => {
    const nomeCat = editCategorie[idx];
    // Conta lavori associati
    const querySnapshot = await getDocs(collection(db, "portfolio"));
    const lavori = querySnapshot.docs.filter(
      (doc) => doc.data().categoria === nomeCat,
    );
    if (lavori.length > 0) {
      setCategoriaDaEliminare(nomeCat);
      setLavoriInCategoria(lavori.length);
      setShowConfermaEliminaCat(true);
    } else {
      // Nessun lavoro, elimina subito
      setEditCategorie(editCategorie.filter((_, i) => i !== idx));
    }
  };
  const confermaEliminaCategoria = async () => {
    if (!categoriaDaEliminare) return;
    // Elimina tutti i lavori associati
    const querySnapshot = await getDocs(collection(db, "portfolio"));
    for (const docSnap of querySnapshot.docs) {
      if (docSnap.data().categoria === categoriaDaEliminare) {
        await deleteDoc(doc(db, "portfolio", docSnap.id));
      }
    }
    // Elimina la categoria dalla lista
    setEditCategorie(
      editCategorie.filter((cat) => cat !== categoriaDaEliminare),
    );
    setShowConfermaEliminaCat(false);
    setCategoriaDaEliminare(null);
    setLavoriInCategoria(0);
    // Aggiorna la lista lavori
    const newSnapshot = await getDocs(collection(db, "portfolio"));
    setItems(
      newSnapshot.docs
        .map((doc) => {
          const data = doc.data() as {
            titolo: string;
            immagine: string;
            macro?: string;
            categoria: string;
            descrizione?: string;
            luogo?: string;
            storagePath?: string;
            visibile?: boolean;
            createdAt?: number;
          };
          return {
            id: doc.id,
            titolo: data.titolo,
            immagine: data.immagine,
            macro: data.macro || "",
            categoria: data.categoria,
            descrizione: data.descrizione || "",
            luogo: data.luogo || "",
            storagePath: data.storagePath || "",
            visibile: data.visibile !== false,
            createdAt: data.createdAt || 0,
          };
        })
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)),
    );
  };

  // AGGIUNTA: Definizione handleAddCategoriaPopup
  const handleAddCategoriaPopup = () => {
    setEditCategorie([...editCategorie, ""]);
  };

  // AGGIUNTA: handleChangeCategoriaPopup
  const handleChangeCategoriaPopup = (idx: number, value: string) => {
    setEditCategorie(editCategorie.map((cat, i) => (i === idx ? value : cat)));
  };

  // FIX: Rimuovo categorie duplicate e vuote ovunque servano chiavi uniche
  // Utility per categorie uniche e non vuote
  const categorieUniche = Array.from(
    new Set(categorie.filter((c) => c.trim())),
  );

  // FIX: Il tasto + aggiungi lavoro deve resettare la categoria e aggiornare le categorie prima di aprire il form
  const handleOpenAddForm = async () => {
    // Aggiorna categorie e macrocategorie da Firebase
    const querySnapshotCat = await getDocs(collection(db, "categorie"));
    const nuoveCategorie = querySnapshotCat.docs
      .map((doc) => doc.data().nome)
      .filter((c) => c.trim());
    setCategorie(Array.from(new Set(nuoveCategorie)));
    setCategories(
      querySnapshotCat.docs.map((doc) => ({
        nome: doc.data().nome,
        macro: doc.data().macro,
      })),
    );
    const querySnapshotMacro = await getDocs(collection(db, "macrocategorie"));
    setMacros(querySnapshotMacro.docs.map((doc) => doc.data().nome));
    setTitolo("");
    setDescrizione("");
    setLuogo("");
    setMacro("");
    setCategoria("");
    setFile(null);
    setShowForm(true);
  };

  // FIX: lavoriFiltrati deve essere definito prima del render della lista
  const lavoriFiltrati = items.filter(
    (i) => categoriaFiltro === "TUTTE" || i.categoria === categoriaFiltro,
  );
  const categoriePerMacro = categories.filter((c) => c.macro === macro);
  const editCategoriePerMacro = categories.filter((c) => c.macro === editMacro);
  const macroHaCategorie = (macroNome: string) =>
    categories.some((c) => c.macro === macroNome);
  const canSaveLavoro =
    !loading &&
    !!macro &&
    !!categoria &&
    !!titolo.trim() &&
    !!file &&
    categoriePerMacro.length > 0;
  const canSaveEdit =
    !loading &&
    !!editMacro &&
    !!editCategoria &&
    !!editTitolo.trim() &&
    (!!editFile || !!editImmagine) &&
    editCategoriePerMacro.length > 0;
  const luoghiSuggeriti = Array.from(
    new Set(
      [...luoghiCatalogo, ...items.map((i) => (i.luogo || "").trim())].filter(
        (luogo) => luogo.length > 0,
      ),
    ),
  );
  const luoghiOpzioni = [...luoghiSuggeriti].sort((a, b) =>
    a.localeCompare(b, "it"),
  );
  const addFilteredLuoghi = luoghiOpzioni
    .filter((l) => l.toLowerCase().includes(luogo.trim().toLowerCase()))
    .slice(0, 8);
  const editFilteredLuoghi = luoghiOpzioni
    .filter((l) => l.toLowerCase().includes(editLuogo.trim().toLowerCase()))
    .slice(0, 8);
  const luogoEsiste = (nome: string) =>
    luoghiSuggeriti.some((l) => l.toLowerCase() === nome.trim().toLowerCase());

  const handleAddLuogoCatalogo = async (nomeRaw: string) => {
    const nome = nomeRaw.trim();
    if (!nome || luogoEsiste(nome)) return;
    setSavingLuogo(true);
    await addDoc(collection(db, "luoghi"), { nome });
    setLuoghiCatalogo((prev) => [...prev, nome]);
    setSavingLuogo(false);
  };

  // Calcola pagine solo su mobile
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const perPageMobile = 6;
  const totalPagesMobile = isMobile
    ? Math.ceil(lavoriFiltrati.length / perPageMobile)
    : 1;
  const lavoriToShow = isMobile
    ? lavoriFiltrati.slice(
        (pageMobile - 1) * perPageMobile,
        pageMobile * perPageMobile,
      )
    : lavoriFiltrati;

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-2xl font-extrabold" style={{ color: bluScuro }}>
            Portfolio lavori
          </h2>
          <p className="text-sm text-[#5f6b63] mt-1">
            Gestisci i lavori pubblicati, la visibilità e la categorizzazione.
          </p>
        </div>
        <button
          onClick={handleOpenAddForm}
          className="bg-[#1E2A22] hover:bg-[#162019] text-white rounded-xl px-4 h-11 flex items-center justify-center shadow text-lg font-semibold"
          title="Aggiungi lavoro"
        >
          <span className="font-bold mr-1">+</span> Nuovo
        </button>
      </div>
      {/* Modifica categorie rimossa su richiesta */}
      {/* Menù categorie orizzontale */}
      <div className="w-full overflow-x-auto mb-6 rounded-2xl bg-[#f5f7f6] border border-[#e2e8e4] p-2">
        <div className="flex gap-2 min-w-max">
          <button
            className={`px-4 py-2 rounded-xl font-semibold text-sm transition whitespace-nowrap ${
              categoriaFiltro === "TUTTE"
                ? "bg-white text-[#1E2A22] shadow border border-[#dce4df]"
                : "text-[#4b5a52] hover:bg-white/70"
            }`}
            onClick={() => setCategoriaFiltro("TUTTE")}
          >
            TUTTE
          </button>
          {categorieUniche.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition whitespace-nowrap ${
                categoriaFiltro === cat
                  ? "bg-white text-[#1E2A22] shadow border border-[#dce4df]"
                  : "text-[#4b5a52] hover:bg-white/70"
              }`}
              onClick={() => {
                setCategoriaFiltro(cat);
                setPageMobile(1);
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      {/* LISTA LAVORI filtrata - nuova griglia con overlay e bottoni */}
      {lavoriFiltrati.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#d1d9d3] bg-[#f8faf9] p-8 text-center text-[#5f6b63]">
          Non ci sono elementi per questa categoria.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {lavoriToShow.map((i) => (
            <div
              key={i.id}
              className="relative group rounded-2xl overflow-hidden shadow-sm border border-[#dbe3de] bg-white"
            >
              {/* Badge visibile se nascosta */}
              {!i.visibile && (
                <div className="absolute top-2 left-2 bg-red-600/90 text-white text-xs font-bold px-3 py-1 rounded-full shadow z-10 flex items-center gap-1">
                  <FaEyeSlash className="inline-block text-white text-base" />
                  Nascosta
                </div>
              )}
              <Image
                src={i.immagine || "/placeholder.jpg"}
                alt={i.titolo}
                width={400}
                height={300}
                className={`object-cover w-full h-48 sm:h-56 md:h-60 transition-transform duration-300 group-hover:scale-105 ${
                  !i.visibile ? "grayscale-[0.7] brightness-75" : ""
                }`}
                style={
                  i.visibile ? {} : { filter: "grayscale(0.7) brightness(0.7)" }
                }
              />
              {/* Azioni sempre visibili su mobile, overlay su hover su desktop */}
              {/* Mobile: azioni sempre visibili sotto immagine */}
              <div className="flex sm:hidden justify-center gap-3 py-2 bg-white/90">
                <button
                  onClick={() => setEditId(i.id)}
                  className="rounded-full bg-blue-100 hover:bg-blue-200 p-2 shadow text-[#1E2A22] text-xl transition"
                  title="Modifica"
                >
                  <MdEdit />
                </button>
                <button
                  onClick={() => setDeleteId(i.id)}
                  className="rounded-full bg-red-100 hover:bg-red-200 p-2 shadow text-red-600 text-xl transition"
                  title="Elimina"
                >
                  <FaTrash />
                </button>
                <button
                  onClick={() => toggleVisibilita(i.id, i.visibile)}
                  className={`rounded-full bg-green-100 hover:bg-green-200 p-2 shadow text-xl transition ${
                    i.visibile ? "text-green-600" : "text-gray-400"
                  }`}
                  title={i.visibile ? "Nascondi dal sito" : "Mostra sul sito"}
                >
                  {i.visibile ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
              {/* Desktop: overlay su hover */}
              <div className="hidden sm:flex absolute inset-0 bg-black/60 flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="mt-2 text-white text-center">
                  <div className="font-bold text-lg truncate max-w-[90%] mx-auto">
                    {i.titolo}
                  </div>
                  <div className="text-xs bg-[#1E2A22]/80 rounded px-2 py-1 inline-block mt-1">
                    {i.categoria}
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setEditId(i.id)}
                    className="rounded-full bg-white/90 hover:bg-blue-100 p-2 shadow text-[#1E2A22] text-xl transition"
                    title="Modifica"
                  >
                    <MdEdit />
                  </button>
                  <button
                    onClick={() => setDeleteId(i.id)}
                    className="rounded-full bg-white/90 hover:bg-red-100 p-2 shadow text-red-600 text-xl transition"
                    title="Elimina"
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={() => toggleVisibilita(i.id, i.visibile)}
                    className={`rounded-full bg-white/90 hover:bg-green-100 p-2 shadow text-xl transition ${
                      i.visibile ? "text-green-600" : "text-gray-400"
                    }`}
                    title={i.visibile ? "Nascondi dal sito" : "Mostra sul sito"}
                  >
                    {i.visibile ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* PAGINAZIONE MOBILE COMPATTA */}
      {isMobile && totalPagesMobile > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => setPageMobile((p) => Math.max(1, p - 1))}
            disabled={pageMobile === 1}
            className={`rounded-full w-9 h-9 flex items-center justify-center border-2 ${
              pageMobile === 1
                ? "border-gray-300 text-gray-400"
                : "border-blue-600 text-blue-600 hover:bg-blue-50"
            } transition`}
            aria-label="Pagina precedente"
          >
            <FaChevronLeft />
          </button>
          {/* Pagine compatte */}
          {(() => {
            const pages = [];
            if (totalPagesMobile <= 5) {
              for (let i = 1; i <= totalPagesMobile; i++) {
                pages.push(i);
              }
            } else {
              // Sempre la prima
              pages.push(1);
              // Puntini se serve
              if (pageMobile > 3) pages.push("...");
              // Pagine vicine
              for (
                let i = Math.max(2, pageMobile - 1);
                i <= Math.min(totalPagesMobile - 1, pageMobile + 1);
                i++
              ) {
                pages.push(i);
              }
              // Puntini se serve
              if (pageMobile < totalPagesMobile - 2) pages.push("...");
              // Sempre l'ultima
              pages.push(totalPagesMobile);
            }
            return pages.map((num, idx) =>
              num === "..." ? (
                [
                  <span key={"dots-" + idx} className="px-1 text-gray-400">
                    ...
                  </span>,
                ]
              ) : (
                <button
                  key={num}
                  onClick={() => setPageMobile(num as number)}
                  className={`rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold border-2 ${
                    pageMobile === num
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 text-blue-600 hover:bg-blue-50"
                  } transition`}
                  aria-label={`Pagina ${num}`}
                >
                  {num}
                </button>
              ),
            );
          })()}
          <button
            onClick={() =>
              setPageMobile((p) => Math.min(totalPagesMobile, p + 1))
            }
            disabled={pageMobile === totalPagesMobile}
            className={`rounded-full w-9 h-9 flex items-center justify-center border-2 ${
              pageMobile === totalPagesMobile
                ? "border-gray-300 text-gray-400"
                : "border-blue-600 text-blue-600 hover:bg-blue-50"
            } transition`}
            aria-label="Pagina successiva"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
      {/* MODAL MODIFICA LAVORO */}
      {editId && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <form
            onSubmit={handleEdit}
            className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col gap-4 relative"
          >
            <button
              type="button"
              onClick={() => setEditId(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
              title="Chiudi"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold" style={{ color: bluScuro }}>
              Modifica lavoro
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={editMacro}
                onChange={(e) => {
                  setEditMacro(e.target.value);
                  setEditCategoria("");
                }}
                className="border rounded px-3 py-2 text-black"
                required
              >
                <option value="" disabled hidden={!!editMacro}>
                  Seleziona macrocategoria
                </option>
                {macros.map((m) => (
                  <option key={m} value={m} disabled={!macroHaCategorie(m)}>
                    {m}
                    {!macroHaCategorie(m) ? " (nessuna categoria)" : ""}
                  </option>
                ))}
              </select>
              <select
                value={editCategoria}
                onChange={(e) => setEditCategoria(e.target.value)}
                className={`border rounded px-3 py-2 text-black ${
                  !editMacro
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : ""
                }`}
                required
                disabled={!editMacro}
              >
                <option value="" disabled hidden={!!editCategoria}>
                  {editMacro
                    ? "Seleziona categoria"
                    : "Prima seleziona una macrocategoria"}
                </option>
                {editCategoriePerMacro.map((cat) => (
                  <option key={cat.nome} value={cat.nome}>
                    {cat.nome}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Titolo"
                value={editTitolo}
                onChange={(e) => setEditTitolo(e.target.value)}
                className="border rounded px-3 py-2 placeholder-gray-500 text-black"
                required
              />
              <div className="md:col-span-2 relative">
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Luogo (opzionale)"
                    value={editLuogo}
                    onFocus={() => setShowEditLuoghiDropdown(true)}
                    onBlur={() =>
                      setTimeout(() => setShowEditLuoghiDropdown(false), 120)
                    }
                    onChange={(e) => {
                      setEditLuogo(e.target.value);
                      setShowEditLuoghiDropdown(true);
                    }}
                    className="border rounded px-3 py-2 placeholder-gray-500 text-black flex-1"
                  />
                  {editLuogo.trim() && !luogoEsiste(editLuogo) && (
                    <button
                      type="button"
                      onClick={() => handleAddLuogoCatalogo(editLuogo)}
                      disabled={savingLuogo}
                      className="bg-green-600 text-white px-3 py-2 rounded font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500"
                    >
                      + Luogo
                    </button>
                  )}
                </div>
                {showEditLuoghiDropdown && editFilteredLuoghi.length > 0 && (
                  <div className="absolute z-20 mt-1 w-full bg-white border rounded-lg shadow max-h-48 overflow-y-auto">
                    {editFilteredLuoghi.map((nome) => (
                      <button
                        key={nome}
                        type="button"
                        onMouseDown={() => {
                          setEditLuogo(nome);
                          setShowEditLuoghiDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 text-black"
                      >
                        {nome}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <textarea
                placeholder="Descrizione"
                value={editDescrizione}
                onChange={(e) => setEditDescrizione(e.target.value)}
                className="border rounded px-3 py-2 placeholder-gray-500 text-black md:col-span-2"
              />
              <div className="flex flex-col items-center gap-2 md:col-span-2">
                {editFile ? (
                  <Image
                    src={URL.createObjectURL(editFile)}
                    alt="Anteprima"
                    width={128}
                    height={128}
                    className="object-cover rounded border"
                  />
                ) : editImmagine ? (
                  <Image
                    src={editImmagine}
                    alt="Immagine lavoro"
                    width={128}
                    height={128}
                    className="object-cover rounded border"
                  />
                ) : (
                  <div className="w-32 h-32 flex items-center justify-center bg-gray-200 text-gray-500 rounded border text-center text-xs">
                    IMMAGINE NON DISPONIBILE
                  </div>
                )}
                <label
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow cursor-pointer mt-2"
                  style={{ backgroundColor: bluScuro }}
                >
                  Scegli immagine
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
              </div>
              {editMacro && editCategoriePerMacro.length === 0 && (
                <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800 md:col-span-2">
                  Questa macrocategoria non ha ancora categorie. Crea prima una
                  categoria per poter salvare.
                  <button
                    type="button"
                    onClick={() => {
                      setEditId(null);
                      onGoToCategorie();
                    }}
                    className="ml-2 underline font-semibold"
                  >
                    Vai a Gestione categorie
                  </button>
                </div>
              )}
            </div>
            <div className="flex gap-3 px-2 mt-2">
              <button
                type="submit"
                className={`py-2 px-6 rounded font-semibold transition-colors ${
                  canSaveEdit
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!canSaveEdit}
              >
                Salva modifiche
              </button>
              <button
                type="button"
                onClick={() => setEditId(null)}
                className="bg-gray-400 text-white py-2 px-6 rounded hover:bg-gray-500 font-semibold"
              >
                Annulla
              </button>
            </div>
          </form>
        </div>
      )}
      {/* AGGIUNTA: Popup overlay per aggiunta lavoro */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <form
            onSubmit={handleAdd}
            className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col gap-4 relative"
          >
            {addError && (
              <div className="bg-red-100 text-red-700 rounded p-2 text-base font-bold border border-red-300 mb-4 text-center animate-pulse shadow">
                {addError}
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
              title="Chiudi"
            >
              &times;
            </button>
            <h3
              className="text-xl font-bold mb-2 text-center"
              style={{ color: bluScuro }}
            >
              Aggiungi lavoro
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={macro}
                onChange={(e) => {
                  setMacro(e.target.value);
                  setCategoria("");
                  setAddError("");
                }}
                className="border rounded px-3 py-2 text-black"
                required
              >
                <option value="" disabled hidden={!!macro}>
                  Seleziona macrocategoria
                </option>
                {macros.map((m) => (
                  <option key={m} value={m} disabled={!macroHaCategorie(m)}>
                    {m}
                    {!macroHaCategorie(m) ? " (nessuna categoria)" : ""}
                  </option>
                ))}
              </select>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className={`border rounded px-3 py-2 text-black ${
                  !macro ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""
                }`}
                required
                disabled={!macro}
              >
                <option value="" disabled hidden={!!categoria}>
                  {macro
                    ? "Seleziona categoria"
                    : "Prima seleziona una macrocategoria"}
                </option>
                {categoriePerMacro.map((cat) => (
                  <option key={cat.nome} value={cat.nome}>
                    {cat.nome}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Titolo"
                value={titolo}
                onChange={(e) => setTitolo(e.target.value)}
                className="border rounded px-3 py-2 placeholder-gray-500 text-black"
                required
              />
              <div className="md:col-span-2 relative">
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Luogo (opzionale)"
                    value={luogo}
                    onFocus={() => setShowAddLuoghiDropdown(true)}
                    onBlur={() =>
                      setTimeout(() => setShowAddLuoghiDropdown(false), 120)
                    }
                    onChange={(e) => {
                      setLuogo(e.target.value);
                      setShowAddLuoghiDropdown(true);
                    }}
                    className="border rounded px-3 py-2 placeholder-gray-500 text-black flex-1"
                  />
                  {luogo.trim() && !luogoEsiste(luogo) && (
                    <button
                      type="button"
                      onClick={() => handleAddLuogoCatalogo(luogo)}
                      disabled={savingLuogo}
                      className="bg-green-600 text-white px-3 py-2 rounded font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500"
                    >
                      + Luogo
                    </button>
                  )}
                </div>
                {showAddLuoghiDropdown && addFilteredLuoghi.length > 0 && (
                  <div className="absolute z-20 mt-1 w-full bg-white border rounded-lg shadow max-h-48 overflow-y-auto">
                    {addFilteredLuoghi.map((nome) => (
                      <button
                        key={nome}
                        type="button"
                        onMouseDown={() => {
                          setLuogo(nome);
                          setShowAddLuoghiDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 text-black"
                      >
                        {nome}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <textarea
                placeholder="Descrizione"
                value={descrizione}
                onChange={(e) => setDescrizione(e.target.value)}
                className="border rounded px-3 py-2 placeholder-gray-500 text-black md:col-span-2"
              />
              <div className="flex flex-col items-center gap-2 md:col-span-2">
                {file ? (
                  <Image
                    src={URL.createObjectURL(file)}
                    alt="Anteprima"
                    width={128}
                    height={128}
                    className="object-cover rounded border"
                  />
                ) : (
                  <div className="w-32 h-32 flex items-center justify-center bg-gray-200 text-gray-500 rounded border text-center text-xs">
                    IMMAGINE NON DISPONIBILE
                  </div>
                )}
                <label
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow cursor-pointer mt-2"
                  style={{ backgroundColor: bluScuro }}
                >
                  Scegli immagine
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      setFile(e.target.files?.[0] || null);
                      if (e.target.files?.[0]) setAddError("");
                    }}
                    className="hidden"
                  />
                </label>
              </div>
              {macro && categoriePerMacro.length === 0 && (
                <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800 md:col-span-2">
                  Questa macrocategoria non ha ancora categorie. Crea prima una
                  categoria per poter salvare.
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      onGoToCategorie();
                    }}
                    className="ml-2 underline font-semibold"
                  >
                    Vai a Gestione categorie
                  </button>
                </div>
              )}
            </div>
            <div className="flex gap-3 px-2">
              <button
                type="submit"
                className={`py-2 px-6 rounded transition-colors font-semibold ${
                  canSaveLavoro
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!canSaveLavoro}
              >
                {loading ? "Salvataggio..." : "Salva lavoro"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-400 text-white py-2 px-6 rounded hover:bg-gray-500 transition-colors font-semibold"
              >
                Annulla
              </button>
            </div>
          </form>
        </div>
      )}
      {/* AGGIUNTA: Popup overlay per modifica categorie */}
      {showCategorie && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCategorieEdit();
            }}
            className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col gap-4 relative"
          >
            <button
              type="button"
              onClick={() => setShowCategorie(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
              title="Chiudi"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold" style={{ color: bluScuro }}>
              Modifica categorie
            </h3>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2 pr-1">
                {editCategorie.map((cat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={cat}
                      onChange={(e) =>
                        handleChangeCategoriaPopup(idx, e.target.value)
                      }
                      className="border rounded px-3 py-2 placeholder-gray-500 text-black flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveCategoria(idx)}
                      className="bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl"
                      title="Elimina categoria"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleAddCategoriaPopup}
                className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 font-semibold shadow mt-2"
                title="Aggiungi categoria"
              >
                + Aggiungi categoria
              </button>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold"
                style={{ backgroundColor: bluScuro }}
              >
                Salva categorie
              </button>
              <button
                type="button"
                onClick={() => setShowCategorie(false)}
                className="bg-gray-400 text-white py-2 rounded hover:bg-gray-500 font-semibold"
              >
                Annulla
              </button>
            </div>
          </form>
        </div>
      )}
      {/* MODALE CONFERMA ELIMINAZIONE CATEGORIA */}
      {showConfermaEliminaCat && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm flex flex-col gap-4 relative">
            <h3 className="text-xl font-bold text-[#1E2A22] mb-2">
              Conferma eliminazione categoria
            </h3>
            <p className="text-[#3a4a5a]">
              Sono stati trovati {lavoriInCategoria} lavori associati alla
              categoria &quot;{categoriaDaEliminare}&quot;.
              <br />
              Eliminando la categoria verranno eliminati anche tutti i lavori
              collegati.
            </p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={confermaEliminaCategoria}
                className="bg-red-600 text-white py-2 rounded hover:bg-red-700 font-semibold"
              >
                Elimina categoria e lavori
              </button>
              <button
                onClick={() => {
                  setShowConfermaEliminaCat(false);
                  setCategoriaDaEliminare(null);
                }}
                className="bg-gray-400 text-white py-2 rounded hover:bg-gray-500 font-semibold"
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}
      {/* POPUP CONFERMA ELIMINAZIONE PORTFOLIO */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm flex flex-col gap-4 relative">
            <h3 className="text-xl font-bold text-[#1E2A22] mb-2">
              Conferma eliminazione
            </h3>
            <p className="text-[#3a4a5a]">
              Sei sicuro di voler eliminare questo lavoro? L&apos;immagine
              collegata verrà rimossa dallo storage.
            </p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleDelete(deleteId)}
                className="bg-red-600 text-white py-2 rounded hover:bg-red-700 font-semibold"
                disabled={deleteLoading}
              >
                {deleteLoading ? "Eliminazione..." : "Elimina"}
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="bg-gray-400 text-white py-2 rounded hover:bg-gray-500 font-semibold"
                disabled={deleteLoading}
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function PreventivoAdmin() {
  const [voci, setVoci] = useState<
    {
      id: string;
      tipo: "opera" | "impianto";
      nome: string;
      dettaglio?: string;
      dettaglioTipo?: "text" | "number";
    }[]
  >([]);
  const [modalOpen, setModalOpen] = useState<null | {
    voce?: (typeof voci)[number];
  }>(null);
  const [form, setForm] = useState({
    tipo: "opera" as "opera" | "impianto",
    nome: "",
    dettaglio: "",
    dettaglioTipo: "text" as "text" | "number",
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchVoci();
  }, []);

  const openAddModal = () => {
    setEditId(null);
    setForm({ tipo: "opera", nome: "", dettaglio: "", dettaglioTipo: "text" });
    setModalOpen({});
  };

  const openEditModal = (voce: (typeof voci)[number]) => {
    setEditId(voce.id);
    setForm({
      tipo: voce.tipo,
      nome: voce.nome,
      dettaglio: voce.dettaglio || "",
      dettaglioTipo: voce.dettaglioTipo || "text",
    });
    setModalOpen({ voce });
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const voceData =
      form.tipo === "opera"
        ? {
            tipo: form.tipo,
            nome: form.nome,
            dettaglio: form.dettaglio,
            dettaglioTipo: form.dettaglioTipo,
          }
        : { tipo: form.tipo, nome: form.nome };
    if (editId) {
      await setDoc(doc(db, "preventivo", editId), voceData);
    } else {
      await addDoc(collection(db, "preventivo"), voceData);
    }
    setModalOpen(null);
    setLoading(false);
    setEditId(null);
    await fetchVoci();
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "preventivo", id));
    setVoci(voci.filter((v) => v.id !== id));
  };

  return (
    <section className="mb-8 text-black">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl font-extrabold" style={{ color: bluScuro }}>
            Gestione Preventivo
          </h2>
          <p className="text-sm text-[#5f6b63] mt-1">
            Aggiungi e modifica le voci disponibili nel modulo preventivo.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-[#1E2A22] text-white py-2.5 px-4 rounded-xl hover:bg-[#162019] transition-colors font-semibold"
        >
          Aggiungi voce
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center px-3">
          <div className="relative w-full max-w-lg bg-white rounded-2xl border border-[#e2e8e4] shadow-xl p-6 sm:p-7">
            <button
              onClick={() => setModalOpen(null)}
              className="absolute top-2 right-2 text-xl text-gray-500 hover:text-red-500"
              aria-label="Chiudi"
            >
              ×
            </button>
            <form onSubmit={handleModalSubmit} className="flex flex-col gap-3">
              <h3
                className="text-xl font-bold pr-8"
                style={{ color: bluScuro }}
              >
                {editId ? "Modifica voce" : "Nuova voce"}
              </h3>
              {/* Radiobutton solo se aggiunta, non modifica */}
              {!editId && (
                <div className="flex gap-4 items-center mb-1">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="tipo"
                      value="opera"
                      checked={form.tipo === "opera"}
                      onChange={() => setForm((f) => ({ ...f, tipo: "opera" }))}
                    />
                    Opera
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="tipo"
                      value="impianto"
                      checked={form.tipo === "impianto"}
                      onChange={() =>
                        setForm((f) => ({ ...f, tipo: "impianto" }))
                      }
                    />
                    Impianto
                  </label>
                </div>
              )}
              <input
                type="text"
                placeholder={
                  form.tipo === "opera" ? "Nome opera" : "Nome impianto"
                }
                value={form.nome}
                onChange={(e) =>
                  setForm((f) => ({ ...f, nome: e.target.value }))
                }
                className="border rounded px-3 py-2 text-black"
                required
              />
              {form.tipo === "opera" && (
                <>
                  <input
                    type="text"
                    placeholder="Dettaglio opera"
                    value={form.dettaglio}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, dettaglio: e.target.value }))
                    }
                    className="border rounded px-3 py-2 text-black"
                    required
                  />
                  <div className="flex gap-2 items-center">
                    <label className="font-semibold">Tipo dettaglio:</label>
                    <select
                      value={form.dettaglioTipo}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          dettaglioTipo: e.target.value as "text" | "number",
                        }))
                      }
                      className="border rounded px-2 py-1 text-black"
                    >
                      <option value="text">Testo</option>
                      <option value="number">Numero</option>
                    </select>
                  </div>
                </>
              )}
              <button
                type="submit"
                className="bg-[#1E2A22] text-white py-2.5 rounded-lg hover:bg-[#162019] transition-colors font-semibold"
                disabled={loading}
              >
                {loading
                  ? "Salvataggio..."
                  : editId
                    ? "Salva Modifiche"
                    : "Aggiungi"}
              </button>
            </form>
          </div>
        </div>
      )}

      {voci.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#d1d9d3] bg-[#f8faf9] p-8 text-center text-[#5f6b63]">
          Nessuna voce presente nel preventivo.
        </div>
      ) : (
        <ul className="space-y-3 text-black">
          {voci.map((v) => (
            <li
              key={v.id}
              className="border border-[#dbe3de] p-4 rounded-xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-white"
            >
              <div className="text-black">
                <div className="flex items-center gap-2 flex-wrap">
                  <strong className="text-[#1E2A22] text-base">{v.nome}</strong>
                  <span className="text-xs bg-[#eef2ef] px-2 py-1 rounded-full text-[#38443c] font-semibold uppercase tracking-wide">
                    {v.tipo}
                  </span>
                </div>
                {v.tipo === "opera" && (
                  <span className="mt-1 block text-sm text-[#4b5a52]">
                    Dettaglio: {v.dettaglio} ({v.dettaglioTipo})
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(v)}
                  className="bg-gray-200 text-[#1E2A22] px-3 py-2 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Modifica
                </button>
                <button
                  onClick={() => handleDelete(v.id)}
                  className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  Elimina
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
