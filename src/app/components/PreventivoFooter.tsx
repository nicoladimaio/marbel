import Link from "next/link";
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
  return (
    <>
      {/* CTA FINALE con effetto parallax */}

      <section
        className="w-full flex flex-col items-center justify-center py-16 px-4 bg-[url('/sfondo.jpg')] bg-cover bg-center bg-fixed relative"
        style={{ minHeight: "300px" }}
      >
        <div className="max-w-2xl w-full mx-auto text-center flex flex-col items-center justify-center relative z-10 space-y-4">
          {eyebrow && (
            <p className="text-sm uppercase tracking-[0.4em] text-white/75 drop-shadow-lg">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="text-3xl font-bold text-white drop-shadow-lg">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-white text-lg drop-shadow-lg">{subtitle}</p>
          )}
          {buttonText && (
            <Link
              href="/preventivo"
              className="px-8 py-3 rounded-xl bg-white text-[#1a2a4e] font-semibold shadow-lg hover:bg-blue-100 transition-all duration-300 text-lg"
            >
              {buttonText}
            </Link>
          )}
        </div>
      </section>
      {/* CONTATTI E INFO */}
      <section className="w-full flex flex-col items-center py-12 bg-white border-t border-gray-200">
        <div className="max-w-4xl w-full mx-auto flex flex-col md:flex-row justify-between gap-8">
          <div>
            <h3 className="text-2xl font-bold text-[#1a2a4e] mb-4">
              Contattaci
            </h3>
            <ul className="text-[#475569] text-lg space-y-2">
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
              <h4 className="text-lg font-semibold text-[#1a2a4e] mb-2">
                Link utili
              </h4>
              <ul className="text-[#475569] space-y-1">
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
