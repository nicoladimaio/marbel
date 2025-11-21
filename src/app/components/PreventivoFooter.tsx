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
        <div className="absolute inset-0 bg-black/35 z-0" />
      </section>
    </>
  );
}
