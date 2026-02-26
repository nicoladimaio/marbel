import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-zinc-200 py-6 px-4 flex flex-col sm:flex-row items-center justify-between font-sans gap-4">
      <div className="flex items-center gap-2">
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
    </footer>
  );
}
