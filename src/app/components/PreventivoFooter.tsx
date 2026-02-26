"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

type PreventivoFooterProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
};

export default function PreventivoFooter({
  eyebrow = "Vuoi un preventivo gratuito?",
  title = "Blocca ora un sopralluogo dedicato",
  subtitle = "Contattaci ora e ricevi una consulenza personalizzata per il tuo progetto.",
  buttonText = "Richiedi preventivo",
}: PreventivoFooterProps) {
  const [backgroundImage, setBackgroundImage] = useState<string>("/sfondo.jpg");
  const [backgroundPosition, setBackgroundPosition] =
    useState<string>("center 50%");

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, "homepage", "hero"));
        if (snap.exists()) {
          const data = snap.data() as {
            imageUrl?: string;
            imagePosition?: string;
          };
          if (data.imageUrl?.trim()) {
            setBackgroundImage(data.imageUrl);
          }
          if (data.imagePosition?.trim()) {
            setBackgroundPosition(data.imagePosition);
          }
        }
      } catch {
        setBackgroundImage("/sfondo.jpg");
        setBackgroundPosition("center 50%");
      }
    })();
  }, []);

  return (
    <>
      {/* CTA FINALE con effetto parallax */}

      <section
        className="w-full flex flex-col items-center justify-center py-16 px-4 bg-cover bg-center bg-fixed relative"
        style={{
          minHeight: "300px",
          backgroundImage: `url('${backgroundImage}')`,
          backgroundPosition,
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0 z-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0, 0, 0, 0.52) 0%, rgba(0, 0, 0, 0.42) 45%, rgba(0, 0, 0, 0.58) 100%)",
          }}
        />

        <div className="max-w-2xl w-full mx-auto text-center flex flex-col items-center justify-center relative z-10 space-y-4">
          {eyebrow && (
            <p className="text-sm uppercase tracking-[0.24em] text-white/85 drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="text-3xl font-bold text-white drop-shadow-[0_3px_8px_rgba(0,0,0,0.6)]">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-white/95 text-lg drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]">
              {subtitle}
            </p>
          )}
          {buttonText && (
            <Link
              href="/preventivo"
              className="inline-flex items-center justify-center px-8 py-3 min-h-11 rounded-xl bg-white text-[#1E2A22] font-semibold shadow-lg hover:bg-blue-50 hover:text-[#317614] transition-all duration-300 text-lg"
            >
              {buttonText}
            </Link>
          )}
        </div>
      </section>
      {/* CONTATTI E INFO */}
      <section className="w-full flex flex-col items-center pt-12 pb-[max(3rem,env(safe-area-inset-bottom))] bg-white border-t border-gray-200">
        <div className="max-w-6xl 2xl:max-w-[90rem] w-full mx-auto flex flex-col md:flex-row justify-between gap-8 px-4 sm:px-6">
          <div>
            <h3 className="text-2xl font-bold text-[#1E2A22] mb-4 ml-4 md:ml-0">
              Contattaci
            </h3>
            <ul className="text-[#475569] text-lg space-y-2 ml-4 md:ml-0">
              <li>
                <strong>Indirizzo:</strong> Via Nazario Sauro 36, 81025
                Marcianise (CE)
              </li>
              <li>
                <strong>Telefono:</strong>{" "}
                <a
                  href="tel:+390212345678"
                  className="text-blue-700 hover:underline"
                >
                  02 12345678
                </a>
              </li>
              <li>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:info@marbel.it"
                  className="text-blue-700 hover:underline"
                >
                  info@marbel.it
                </a>
              </li>
              <li>
                <strong>Orari:</strong> Lun-Ven 9:00-18:00
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-4 justify-between">
            <div>
              <h4 className="text-lg font-semibold text-[#1E2A22] mb-2 ml-4 md:ml-0">
                Link utili
              </h4>
              <ul className="text-[#475569] space-y-1 ml-4 md:ml-0">
                <li>
                  <a href="/privacy" className="hover:underline">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/cookie" className="hover:underline">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="/contatti" className="hover:underline">
                    Modulo contatti
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
