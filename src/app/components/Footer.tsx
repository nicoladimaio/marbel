import Image from "next/image";
import { FaFacebook, FaInstagram, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-zinc-200 py-6 px-4 flex flex-col sm:flex-row items-center justify-between font-sans gap-4">
      <div className="flex items-center gap-2">
        <Image
          src="/logo.png"
          alt="Logo Mar.Bel."
          width={40}
          height={40}
          className="drop-shadow"
        />
      </div>
      <div className="flex items-center gap-6">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener"
          className="text-blue-600 hover:text-blue-800"
        >
          <FaFacebook size={22} />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener"
          className="text-pink-500 hover:text-pink-700"
        >
          <FaInstagram size={22} />
        </a>
        <a
          href="mailto:info@impresaedile.it"
          className="text-zinc-600 hover:text-blue-700"
        >
          <FaEnvelope size={22} />
        </a>
        <span className="text-zinc-500 text-sm ml-4">info@impresaedile.it</span>
      </div>
      <div className="text-zinc-500 text-sm text-center sm:text-right">
        © {new Date().getFullYear()} Tutti i diritti riservati
      </div>
    </footer>
  );
}
