import {
  FaFacebook,
  FaInstagram,
  FaEnvelope,
  FaWhatsapp,
} from "react-icons/fa";

export default function SocialBar() {
  return (
    <div className="fixed top-1/2 right-4 z-50 flex flex-col gap-4 -translate-y-1/2">
      <a
        href="https://facebook.com"
        target="_blank"
        rel="noopener"
        className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-lg text-blue-600 hover:text-blue-800 transition-colors duration-300"
      >
        <FaFacebook size={28} />
      </a>
      <a
        href="https://instagram.com"
        target="_blank"
        rel="noopener"
        className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-lg text-pink-500 hover:text-pink-700 transition-colors duration-300"
      >
        <FaInstagram size={28} />
      </a>
      <a
        href="https://wa.me/393331234567"
        target="_blank"
        rel="noopener"
        className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-lg text-green-500 hover:text-green-700 transition-colors duration-300"
      >
        <FaWhatsapp size={28} />
      </a>
      <a
        href="mailto:info@impresaedile.it"
        className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-lg text-zinc-600 hover:text-blue-700 transition-colors duration-300"
      >
        <FaEnvelope size={28} />
      </a>
    </div>
  );
}
