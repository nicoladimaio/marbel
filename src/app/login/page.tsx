"use client";

import React, { useState } from "react";
import { MdHome } from "react-icons/md";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch (err) {
      const message =
        err &&
        typeof err === "object" &&
        "code" in err &&
        err.code === "auth/invalid-credential"
          ? "Credenziali non valide. Riprova."
          : "Errore di autenticazione.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f6fa] flex flex-col items-center py-16 px-4 sm:px-8 font-sans relative">
      <button
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 p-2 rounded-full bg-white hover:bg-gray-200 shadow text-[#1a2a4e] text-3xl z-10"
        type="button"
        title="Torna alla homepage"
        aria-label="Torna alla homepage"
      >
        <MdHome />
      </button>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1a2a4e] mb-8 mt-24">
        Login
      </h1>
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-4 w-full max-w-md bg-white rounded-2xl shadow p-6"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded px-3 py-2 text-black"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded px-3 py-2 text-black"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
          disabled={loading}
        >
          {loading ? "Accesso..." : "Accedi"}
        </button>
        {error && <p className="text-red-600">{error}</p>}
      </form>
    </main>
  );
}
