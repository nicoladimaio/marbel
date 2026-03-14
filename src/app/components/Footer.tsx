import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-zinc-200 py-6 px-4 font-sans">
      <div className="mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
        <div className="hidden sm:block" aria-hidden />
        <div className="flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Logo Mar.Bel."
            width={90}
            height={90}
            className="drop-shadow"
          />
        </div>
        <div className="text-zinc-500 text-sm text-center sm:text-right">
          © {new Date().getFullYear()} Tutti i diritti riservati
        </div>
      </div>
    </footer>
  );
}
