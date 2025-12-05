"use client";
import React, { useEffect, useState, useRef } from "react";
import { MdEdit } from "react-icons/md";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
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

const tabs = [
  { key: "offerte", label: "Offerte" },
  { key: "portfolio", label: "Portfolio Lavori" },
  { key: "preventivo", label: "Preventivi" },
];

// Colore blu scuro usato nella homepage
const bluScuro = "#1a2a4e";
// UID autorizzato da Firebase Console (sostituisci con quello reale)

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState("offerte");
  const router = useRouter();

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

  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-white flex flex-col items-center justify-center py-16 px-4 sm:px-8 font-sans">
        <p className="text-[#1a2a4e] text-lg font-semibold">Caricamento…</p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-white flex flex-col items-center py-16 px-4 sm:px-8 font-sans">
      <h1
        className="text-4xl sm:text-5xl font-extrabold mb-8"
        style={{ color: bluScuro, textShadow: "0 1px 4px #e3e8f0" }}
      >
        Area amministrazione
      </h1>
      <div className="w-full max-w-4xl mb-8">
        <div className="flex gap-4 justify-center mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded font-semibold shadow transition text-white`}
              style={{ backgroundColor: bluScuro }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="bg-white rounded-2xl shadow p-6">
          {activeTab === "offerte" && <OfferteAdmin />}
          {activeTab === "portfolio" && <PortfolioAdmin />}
          {activeTab === "preventivo" && (
            <div>Gestione preventivi (aggiungi, modifica, elimina)</div>
          )}
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="mt-8 px-4 py-2 rounded bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition"
      >
        Logout
      </button>
    </main>
  );
}

function OfferteAdmin() {
  const [offerte, setOfferte] = useState<
    {
      id: string;
      titolo: string;
      descrizione: string;
      immagine: string;
      storagePath?: string;
    }[]
  >([]);
  const [titolo, setTitolo] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [immagine, setImmagine] = useState("");
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
          };
          return {
            id: doc.id,
            titolo: data.titolo,
            descrizione: data.descrizione,
            immagine: data.immagine,
            storagePath: data.storagePath || "",
          };
        })
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

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let imageUrl = "";
    let storagePath = "";
    if (file) {
      try {
        const storageRef = ref(storage, `offerte/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(storageRef);
        storagePath = storageRef.fullPath;
      } catch (err) {
        imageUrl = "";
        storagePath = "";
      }
    }
    await addDoc(collection(db, "offerte"), {
      titolo,
      descrizione,
      immagine: imageUrl,
      storagePath,
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
        };
        return {
          id: doc.id,
          titolo: data.titolo,
          descrizione: data.descrizione,
          immagine: data.immagine,
          storagePath: data.storagePath || "",
        };
      })
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
      } catch (err) {
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
          `offerte/${Date.now()}_${editFile.name}`
        );
        await uploadBytes(storageRef, editFile);
        imageUrl = await getDownloadURL(storageRef);
      } catch (err) {
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
      { merge: true }
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
        };
        return {
          id: doc.id,
          titolo: data.titolo,
          descrizione: data.descrizione,
          immagine: data.immagine,
          storagePath: data.storagePath || "",
        };
      })
    );
  };

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2
          className="text-2xl font-extrabold"
          style={{ color: bluScuro, textShadow: "0 1px 4px #e3e8f0" }}
        >
          Offerte disponibili
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg text-3xl"
          title="Aggiungi offerta"
        >
          <span className="font-bold">+</span>
        </button>
      </div>
      {/* POPUP INSERIMENTO OFFERTA */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <form
            onSubmit={handleAdd}
            className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col gap-4 relative"
          >
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
              title="Chiudi"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold" style={{ color: bluScuro }}>
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
              required
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
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors font-semibold"
                disabled={loading}
              >
                {loading ? "Salvataggio..." : "Salva Offerta"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-400 text-white py-2 rounded hover:bg-gray-500 transition-colors font-semibold"
              >
                Annulla
              </button>
            </div>
          </form>
        </div>
      )}
      <ul className="space-y-4">
        {offerte.map((o) => (
          <li
            key={o.id}
            className="bg-gradient-to-r from-[#f5f6fa] via-white to-[#e3e8f0] border border-[#d1d5db] rounded-2xl shadow-lg flex items-center p-4 gap-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex-shrink-0">
              <Image
                src={o.immagine || "/placeholder.jpg"}
                alt={o.titolo}
                width={120}
                height={80}
                className="object-cover rounded-xl w-[120px] h-[80px] bg-gray-200 border border-[#b0b7c3]"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-[#1a2a4e] truncate mb-1">
                {o.titolo}
              </h3>
              <p className="text-base text-[#3a4a5a] mt-1 mb-0 leading-snug">
                {o.descrizione}
              </p>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <button
                onClick={() => setEditId(o.id)}
                className="px-4 py-2 rounded-lg font-semibold shadow text-white"
                style={{ backgroundColor: bluScuro }}
                title="Modifica"
              >
                Modifica
              </button>
              <button
                onClick={() => setDeleteId(o.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow"
              >
                Elimina
              </button>
            </div>
          </li>
        ))}
      </ul>
      {/* POPUP CONFERMA ELIMINAZIONE */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm flex flex-col gap-4 relative">
            <h3 className="text-xl font-bold text-[#1a2a4e] mb-2">
              Conferma eliminazione
            </h3>
            <p className="text-[#3a4a5a]">
              Sei sicuro di voler eliminare questa offerta? L'immagine collegata
              verrà rimossa dallo storage.
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
      {/* MODAL MODIFICA OFFERTA */}
      {editId && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <form
            onSubmit={handleEdit}
            className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col gap-4 relative"
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
                className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold"
                style={{ backgroundColor: bluScuro }}
              >
                Salva modifiche
              </button>
              <button
                type="button"
                onClick={() => setEditId(null)}
                className="bg-gray-400 text-white py-2 rounded hover:bg-gray-500 font-semibold"
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

function PortfolioAdmin() {
  const [items, setItems] = useState<
    {
      id: string;
      titolo: string;
      immagine: string;
      categoria: string;
      storagePath?: string;
    }[]
  >([]);
  const [titolo, setTitolo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("TUTTE");
  const [file, setFile] = useState<File | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [categorie, setCategorie] = useState<string[]>([]);
  const [newCategoria, setNewCategoria] = useState("");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitolo, setEditTitolo] = useState("");
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

  useEffect(() => {
    // Carica portfolio
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, "portfolio"));
      setItems(
        querySnapshot.docs.map((doc) => {
          const data = doc.data() as {
            titolo: string;
            immagine: string;
            categoria: string;
            storagePath?: string;
          };
          return {
            id: doc.id,
            titolo: data.titolo,
            immagine: data.immagine,
            categoria: data.categoria,
            storagePath: data.storagePath || "",
          };
        })
      );
    };
    // Carica categorie
    const fetchCategorie = async () => {
      const querySnapshot = await getDocs(collection(db, "categorie"));
      setCategorie(querySnapshot.docs.map((doc) => doc.data().nome));
    };
    fetchItems();
    fetchCategorie();
  }, []);

  // FIX: editCategorie deve essere sincronizzato con categorie quando si apre il popup
  useEffect(() => {
    if (showCategorie) {
      setEditCategorie(categorie);
    }
  }, [showCategorie, categoria]);

  useEffect(() => {
    setEditCategoria(categoria);
  }, [categoria]);

  // Modifica lavoro
  useEffect(() => {
    if (editId) {
      const item = items.find((i) => i.id === editId);
      if (item) {
        setEditTitolo(item.titolo);
        setEditImmagine(item.immagine);
        setEditCategoria(item.categoria);
        setEditFile(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let imageUrl = "";
    let storagePath = "";
    if (file) {
      try {
        const storageRef = ref(storage, `portfolio/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(storageRef);
        storagePath = storageRef.fullPath;
      } catch (err) {
        imageUrl = "";
        storagePath = "";
      }
    }
    await addDoc(collection(db, "portfolio"), {
      titolo,
      immagine: imageUrl,
      categoria,
      storagePath,
    });
    setTitolo("");
    setCategoria("");
    setFile(null);
    setShowForm(false);
    const querySnapshot = await getDocs(collection(db, "portfolio"));
    setItems(
      querySnapshot.docs.map((doc) => {
        const data = doc.data() as {
          titolo: string;
          immagine: string;
          categoria: string;
          storagePath?: string;
        };
        return {
          id: doc.id,
          titolo: data.titolo,
          immagine: data.immagine,
          categoria: data.categoria,
          storagePath: data.storagePath || "",
        };
      })
    );
    setLoading(false);
  };

  const handleAddCategoria = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoria.trim()) return;
    await addDoc(collection(db, "categorie"), { nome: newCategoria.trim() });
    setCategorie([...categorie, newCategoria.trim()]);
    setNewCategoria("");
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    let imageUrl = editImmagine;
    let storagePath = "";
    if (editFile) {
      try {
        const storageRef = ref(
          storage,
          `portfolio/${Date.now()}_${editFile.name}`
        );
        await uploadBytes(storageRef, editFile);
        imageUrl = await getDownloadURL(storageRef);
        storagePath = storageRef.fullPath;
      } catch (err) {
        // errore upload, mantieni immagine precedente
      }
    }
    await setDoc(
      doc(db, "portfolio", editId),
      {
        titolo: editTitolo,
        immagine: imageUrl,
        categoria: editCategoria,
        ...(storagePath ? { storagePath } : {}),
      },
      { merge: true }
    );
    setEditId(null);
    // Aggiorna lista
    const querySnapshot = await getDocs(collection(db, "portfolio"));
    setItems(
      querySnapshot.docs.map((doc) => {
        const data = doc.data() as {
          titolo: string;
          immagine: string;
          categoria: string;
          storagePath?: string;
        };
        return {
          id: doc.id,
          titolo: data.titolo,
          immagine: data.immagine,
          categoria: data.categoria,
          storagePath: data.storagePath || "",
        };
      })
    );
  };

  const handleDelete = async (id: string) => {
    setDeleteLoading(true);
    const item = items.find((i) => i.id === id);
    if (item && item.storagePath) {
      try {
        const imageRef = ref(storage, item.storagePath);
        await deleteObject(imageRef);
      } catch (err) {}
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
      new Set(editCategorie.map((c) => c.trim()).filter((c) => c))
    );
    for (const nome of uniqueCategorie) {
      await addDoc(collection(db, "categorie"), { nome });
    }
    setCategorie(uniqueCategorie);
    setShowCategorie(false);
    // Aggiorna la lista lavori
    const newSnapshot = await getDocs(collection(db, "portfolio"));
    setItems(
      newSnapshot.docs.map((doc) => {
        const data = doc.data() as {
          titolo: string;
          immagine: string;
          categoria: string;
          storagePath?: string;
        };
        return {
          id: doc.id,
          titolo: data.titolo,
          immagine: data.immagine,
          categoria: data.categoria,
          storagePath: data.storagePath || "",
        };
      })
    );
  };

  const handleRemoveCategoria = async (idx: number) => {
    const nomeCat = editCategorie[idx];
    // Conta lavori associati
    const querySnapshot = await getDocs(collection(db, "portfolio"));
    const lavori = querySnapshot.docs.filter(
      (doc) => doc.data().categoria === nomeCat
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
      editCategorie.filter((cat) => cat !== categoriaDaEliminare)
    );
    setShowConfermaEliminaCat(false);
    setCategoriaDaEliminare(null);
    setLavoriInCategoria(0);
    // Aggiorna la lista lavori
    const newSnapshot = await getDocs(collection(db, "portfolio"));
    setItems(
      newSnapshot.docs.map((doc) => {
        const data = doc.data() as {
          titolo: string;
          immagine: string;
          categoria: string;
          storagePath?: string;
        };
        return {
          id: doc.id,
          titolo: data.titolo,
          immagine: data.immagine,
          categoria: data.categoria,
          storagePath: data.storagePath || "",
        };
      })
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
    new Set(categorie.filter((c) => c.trim()))
  );

  // FIX: Il tasto + aggiungi lavoro deve resettare la categoria e aggiornare le categorie prima di aprire il form
  const handleOpenAddForm = async () => {
    // Aggiorna categorie da Firebase
    const querySnapshot = await getDocs(collection(db, "categorie"));
    const nuoveCategorie = querySnapshot.docs
      .map((doc) => doc.data().nome)
      .filter((c) => c.trim());
    setCategorie(Array.from(new Set(nuoveCategorie)));
    setCategoria("");
    setShowForm(true);
  };

  // FIX: lavoriFiltrati deve essere definito prima del render della lista
  const lavoriFiltrati = items.filter(
    (i) => categoriaFiltro === "TUTTE" || i.categoria === categoriaFiltro
  );

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2
          className="text-2xl font-extrabold"
          style={{ color: bluScuro, textShadow: "0 1px 4px #e3e8f0" }}
        >
          Portfolio lavori
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg text-3xl"
            title="Aggiungi lavoro"
          >
            <span className="font-bold">+</span>
          </button>
          <button
            onClick={() => setShowCategorie(true)}
            className="bg-[#1a2a4e] hover:bg-[#274472] text-white rounded-lg px-6 py-2 font-semibold shadow text-base flex items-center gap-2"
            style={{ backgroundColor: bluScuro }}
            title="Modifica categorie"
          >
            <MdEdit size={20} />
            Modifica categorie
          </button>
        </div>
      </div>
      {/* Menù categorie orizzontale */}
      <div className="w-full overflow-x-auto mb-6">
        <div className="flex gap-2 min-w-max pb-2">
          <button
            className={`px-4 py-2 rounded-full font-semibold shadow text-sm transition whitespace-nowrap ${
              categoriaFiltro === "TUTTE"
                ? "bg-[#1a2a4e] text-white"
                : "bg-gray-200 text-[#1a2a4e]"
            }`}
            onClick={() => setCategoriaFiltro("TUTTE")}
          >
            TUTTE
          </button>
          {categorieUniche.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full font-semibold shadow text-sm transition whitespace-nowrap ${
                categoriaFiltro === cat
                  ? "bg-[#1a2a4e] text-white"
                  : "bg-gray-200 text-[#1a2a4e]"
              }`}
              onClick={() => setCategoriaFiltro(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      {/* LISTA LAVORI filtrata */}
      <ul className="space-y-4">
        {lavoriFiltrati.length === 0 ? (
          <li className="text-center text-gray-500 py-8">
            Non ci sono elementi per questa categoria
          </li>
        ) : (
          lavoriFiltrati.map((i) => (
            <li
              key={i.id}
              className="bg-gradient-to-r from-[#f5f6fa] via-white to-[#e3e8f0] border border-[#d1d5db] rounded-2xl shadow-lg flex items-center p-4 gap-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex-shrink-0">
                <Image
                  src={i.immagine || "/placeholder.jpg"}
                  alt={i.titolo}
                  width={120}
                  height={80}
                  className="object-cover rounded-xl w-[120px] h-[80px] bg-gray-200 border border-[#b0b7c3]"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-[#1a2a4e] truncate mb-1">
                  {i.titolo}
                </h3>
                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-[#1a2a4e] text-white text-xs font-semibold">
                  {i.categoria}
                </span>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <button
                  onClick={() => setEditId(i.id)}
                  className="px-4 py-2 rounded-lg font-semibold shadow text-white"
                  style={{ backgroundColor: bluScuro }}
                  title="Modifica"
                >
                  Modifica
                </button>
                <button
                  onClick={() => setDeleteId(i.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow"
                >
                  Elimina
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
      {/* MODAL MODIFICA LAVORO */}
      {editId && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <form
            onSubmit={handleEdit}
            className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col gap-4 relative"
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
            <input
              type="text"
              placeholder="Titolo"
              value={editTitolo}
              onChange={(e) => setEditTitolo(e.target.value)}
              className="border rounded px-3 py-2 placeholder-gray-500 text-black"
              required
            />
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="border rounded px-3 py-2 text-black"
              required
            >
              <option value="">Seleziona categoria</option>
              {categorieUniche.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
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
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold"
                style={{ backgroundColor: bluScuro }}
              >
                Salva modifiche
              </button>
              <button
                type="button"
                onClick={() => setEditId(null)}
                className="bg-gray-400 text-white py-2 rounded hover:bg-gray-500 font-semibold"
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
            className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col gap-4 relative"
          >
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
              title="Chiudi"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold" style={{ color: bluScuro }}>
              Aggiungi lavoro
            </h3>
            <input
              type="text"
              placeholder="Titolo"
              value={titolo}
              onChange={(e) => setTitolo(e.target.value)}
              className="border rounded px-3 py-2 placeholder-gray-500 text-black"
              required
            />
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="border rounded px-3 py-2 text-black"
              required
            >
              <option value="">Seleziona categoria</option>
              {categorieUniche.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
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
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                  required
                />
              </label>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors font-semibold"
                disabled={loading}
              >
                {loading ? "Salvataggio..." : "Salva lavoro"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-400 text-white py-2 rounded hover:bg-gray-500 transition-colors font-semibold"
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
            <h3 className="text-xl font-bold text-[#1a2a4e] mb-2">
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
            <h3 className="text-xl font-bold text-[#1a2a4e] mb-2">
              Conferma eliminazione
            </h3>
            <p className="text-[#3a4a5a]">
              Sei sicuro di voler eliminare questo lavoro? L'immagine collegata
              verrà rimossa dallo storage.
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
    { id: string; voce: string; prezzo: string }[]
  >([]);
  const [voce, setVoce] = useState("");
  const [prezzo, setPrezzo] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await addDoc(collection(db, "preventivo"), { voce, prezzo });
    setVoce("");
    setPrezzo("");
    const querySnapshot = await getDocs(collection(db, "preventivo"));
    setVoci(
      querySnapshot.docs.map((doc) => {
        const data = doc.data() as { voce: string; prezzo: string };
        return { id: doc.id, voce: data.voce, prezzo: data.prezzo };
      })
    );
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "preventivo", id));
    setVoci(voci.filter((v) => v.id !== id));
  };

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Gestione Preventivo</h2>
      <form onSubmit={handleAdd} className="flex flex-col gap-2 mb-4">
        <input
          type="text"
          placeholder="Voce di preventivo"
          value={voce}
          onChange={(e) => setVoce(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />
        <input
          type="text"
          placeholder="Prezzo"
          value={prezzo}
          onChange={(e) => setPrezzo(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors"
          disabled={loading}
        >
          {loading ? "Salvataggio..." : "Aggiungi Voce"}
        </button>
      </form>
      <ul className="space-y-2">
        {voci.map((v) => (
          <li
            key={v.id}
            className="border p-3 rounded flex justify-between items-center"
          >
            <div>
              <strong>{v.voce}</strong> - {v.prezzo} €
            </div>
            <button
              onClick={() => handleDelete(v.id)}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
            >
              Elimina
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
