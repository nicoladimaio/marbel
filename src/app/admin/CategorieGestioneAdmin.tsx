"use client";
import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { FaPlus, FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

export default function CategorieGestioneAdmin() {
  // Popup state
  const [showMacroPopup, setShowMacroPopup] = useState(false);
  const [showCatPopup, setShowCatPopup] = useState(false);
  const [editMacroId, setEditMacroId] = useState<string | null>(null);
  const [editCatId, setEditCatId] = useState<string | null>(null);
  const [popupValue, setPopupValue] = useState("");
  const [macros, setMacros] = useState<{ id: string; nome: string }[]>([]);
  const [categories, setCategories] = useState<
    { id: string; nome: string; macro: string }[]
  >([]);
  const [macroSel, setMacroSel] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      const snapMacro = await getDocs(collection(db, "macrocategorie"));
      setMacros(
        snapMacro.docs.map((doc) => ({ id: doc.id, nome: doc.data().nome })),
      );
      const snapCat = await getDocs(collection(db, "categorie"));
      setCategories(
        snapCat.docs.map((doc) => ({
          id: doc.id,
          nome: doc.data().nome,
          macro: doc.data().macro,
        })),
      );
    };
    fetchAll();
  }, []);

  // Macro CRUD
  const handleAddMacro = async () => {
    if (!popupValue.trim()) return;
    setLoading(true);
    await addDoc(collection(db, "macrocategorie"), { nome: popupValue.trim() });
    setPopupValue("");
    setShowMacroPopup(false);
    const snap = await getDocs(collection(db, "macrocategorie"));
    setMacros(snap.docs.map((doc) => ({ id: doc.id, nome: doc.data().nome })));
    setLoading(false);
  };
  const handleEditMacro = async () => {
    if (!popupValue.trim() || !editMacroId) return;
    setLoading(true);
    const { setDoc } = await import("firebase/firestore");
    await setDoc(
      doc(db, "macrocategorie", editMacroId),
      { nome: popupValue.trim() },
      { merge: true },
    );
    setPopupValue("");
    setEditMacroId(null);
    setShowMacroPopup(false);
    const snap = await getDocs(collection(db, "macrocategorie"));
    setMacros(snap.docs.map((doc) => ({ id: doc.id, nome: doc.data().nome })));
    setLoading(false);
  };
  const handleDeleteMacro = async (id: string) => {
    setLoading(true);
    await deleteDoc(doc(db, "macrocategorie", id));
    setMacros(macros.filter((m) => m.id !== id));
    setLoading(false);
    if (macroSel === id) setMacroSel("");
  };

  // Categoria CRUD
  const handleAddCat = async () => {
    if (!popupValue.trim() || !macroSel) return;
    setLoading(true);
    await addDoc(collection(db, "categorie"), {
      nome: popupValue.trim(),
      macro: macros.find((m) => m.id === macroSel)?.nome || "",
    });
    setPopupValue("");
    setShowCatPopup(false);
    const snapCat = await getDocs(collection(db, "categorie"));
    setCategories(
      snapCat.docs.map((doc) => ({
        id: doc.id,
        nome: doc.data().nome,
        macro: doc.data().macro,
      })),
    );
    setLoading(false);
  };
  const handleEditCat = async () => {
    if (!popupValue.trim() || !editCatId) return;
    setLoading(true);
    const { setDoc } = await import("firebase/firestore");
    await setDoc(
      doc(db, "categorie", editCatId),
      { nome: popupValue.trim() },
      { merge: true },
    );
    setPopupValue("");
    setEditCatId(null);
    setShowCatPopup(false);
    const snapCat = await getDocs(collection(db, "categorie"));
    setCategories(
      snapCat.docs.map((doc) => ({
        id: doc.id,
        nome: doc.data().nome,
        macro: doc.data().macro,
      })),
    );
    setLoading(false);
  };
  const handleDeleteCat = async (id: string) => {
    setLoading(true);
    await deleteDoc(doc(db, "categorie", id));
    setCategories(categories.filter((c) => c.id !== id));
    setLoading(false);
  };

  // Macro selezionata: id
  const macroSelected = macros.find((m) => m.id === macroSel);
  const filteredCategories = macroSelected
    ? categories.filter((c) => c.macro === macroSelected.nome)
    : [];

  return (
    <section className="mb-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Macrocategorie cards */}
        <div className="flex-1 min-w-[220px]">
          <div className="flex items-center mb-4">
            <h3 className="text-xl font-bold text-[#111] flex-1">
              Macrocategorie
            </h3>
            <button
              className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-lg hover:bg-green-700 transition ml-2"
              title="Aggiungi macrocategoria"
              onClick={() => {
                setPopupValue("");
                setEditMacroId(null);
                setShowMacroPopup(true);
              }}
            >
              <FaPlus />
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {macros.map((m) => (
              <div
                key={m.id}
                className={`group shadow-lg rounded-xl px-4 py-3 flex items-center transition-all cursor-pointer ${macroSel === m.id ? "bg-green-50 border border-green-600 scale-[1.03]" : "bg-white hover:bg-green-100"}`}
                onClick={() => setMacroSel(m.id)}
                style={{
                  boxShadow:
                    macroSel === m.id
                      ? "0 4px 16px #25602933"
                      : "0 2px 8px #e3e8f0",
                }}
              >
                <span className="text-lg font-semibold text-[#256029] flex-1">
                  {m.nome}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPopupValue(m.nome);
                    setEditMacroId(m.id);
                    setShowMacroPopup(true);
                  }}
                  className="opacity-80 hover:opacity-100 transition-opacity text-blue-600 text-base ml-2"
                  title="Modifica macrocategoria"
                >
                  <MdEdit />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteMacro(m.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 text-base ml-2"
                  title="Elimina macrocategoria"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* Categorie chips */}
        <div className="flex-1 min-w-[220px] relative">
          <div className="flex items-center mb-4">
            <h3 className="text-xl font-bold text-[#111] flex-1">Categorie</h3>
            {macroSel && (
              <button
                className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-lg hover:bg-green-700 transition ml-2"
                title="Aggiungi categoria"
                onClick={() => {
                  setPopupValue("");
                  setEditCatId(null);
                  setShowCatPopup(true);
                }}
              >
                <FaPlus />
              </button>
            )}
          </div>
          {!macroSel && (
            <div className="text-xs text-gray-500 mb-2">
              Seleziona una macrocategoria per vedere le categorie collegate
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {filteredCategories.map((c) => (
              <div
                key={c.id}
                className="relative group px-4 py-2 bg-green-100 text-[#256029] rounded-full font-semibold shadow-sm flex items-center transition-all hover:bg-green-200"
              >
                <span>{c.nome}</span>
                <button
                  onClick={() => {
                    setPopupValue(c.nome);
                    setEditCatId(c.id);
                    setShowCatPopup(true);
                  }}
                  className="opacity-80 hover:opacity-100 transition-opacity text-blue-600 text-base ml-2"
                  title="Modifica categoria"
                >
                  <MdEdit />
                </button>
                <button
                  onClick={() => handleDeleteCat(c.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 text-base ml-2"
                  title="Elimina categoria"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* POPUP MODAL */}
      {(showMacroPopup || showCatPopup) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xs flex flex-col gap-4 relative animate-fade-in">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => {
                setShowMacroPopup(false);
                setShowCatPopup(false);
                setEditMacroId(null);
                setEditCatId(null);
                setPopupValue("");
              }}
              title="Chiudi"
            >
              &times;
            </button>
            <h3 className="text-lg font-bold text-[#256029] mb-2">
              {showMacroPopup
                ? editMacroId
                  ? "Modifica macrocategoria"
                  : "Aggiungi macrocategoria"
                : editCatId
                  ? "Modifica categoria"
                  : "Aggiungi categoria"}
            </h3>
            <input
              value={popupValue}
              onChange={(e) => setPopupValue(e.target.value)}
              className="border rounded px-3 py-2 text-[#256029] font-semibold text-lg"
              placeholder={
                showMacroPopup ? "Nome macrocategoria" : "Nome categoria"
              }
              autoFocus
              disabled={loading}
            />
            <button
              className="bg-green-600 text-white py-2 rounded font-semibold text-lg shadow hover:bg-green-700 transition"
              disabled={loading || !popupValue.trim()}
              onClick={() => {
                if (showMacroPopup) {
                  if (editMacroId) {
                    void handleEditMacro();
                  } else {
                    void handleAddMacro();
                  }
                } else {
                  if (editCatId) {
                    void handleEditCat();
                  } else {
                    void handleAddCat();
                  }
                }
              }}
            >
              {showMacroPopup
                ? editMacroId
                  ? "Salva"
                  : "Aggiungi"
                : editCatId
                  ? "Salva"
                  : "Aggiungi"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
