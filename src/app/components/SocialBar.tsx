"use client";
import {
  FaFacebook,
  FaInstagram,
  FaEnvelope,
  FaWhatsapp,
} from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";

export default function SocialBar() {
  const [open, setOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        popupRef.current &&
        !popupRef.current.contains(target) &&
        fabRef.current &&
        !fabRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const links = [
    {
      href: "https://facebook.com",
      label: "Facebook",
      icon: <FaFacebook size={28} />,
      className: "text-blue-600 hover:text-blue-800",
    },
    {
      href: "https://instagram.com",
      label: "Instagram",
      icon: <FaInstagram size={28} />,
      className: "text-pink-500 hover:text-pink-700",
    },
    {
      href: "https://wa.me/393331234567",
      label: "WhatsApp",
      icon: <FaWhatsapp size={28} />,
      className: "text-green-500 hover:text-green-700",
    },
    {
      href: "mailto:info@impresaedile.it",
      label: "Email",
      icon: <FaEnvelope size={28} />,
      className: "text-zinc-600 hover:text-blue-700",
    },
  ];

  return (
    <>
      {/* Desktop: barra verticale invariata */}
      <div className="fixed top-1/2 right-4 z-50 hidden md:flex flex-col gap-4 -translate-y-1/2">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener"
            aria-label={link.label}
            className={`w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-lg transition-colors duration-300 ${link.className}`}
          >
            {link.icon}
          </a>
        ))}
      </div>

      {/* Mobile: FAB + popup */}
      <div className="fixed bottom-5 right-5 z-50 md:hidden">
        <button
          ref={fabRef}
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Apri menu social"
          className="w-12 h-12 rounded-full bg-white shadow-xl border border-white/60 flex items-center justify-center text-[#1a2a4e] hover:text-[#223867] transition-colors"
        >
          <FiShare2 size={24} />
        </button>

        <div className="relative">
          <div
            ref={popupRef}
            className={`absolute bottom-14 right-0 origin-bottom-right bg-white rounded-2xl shadow-2xl border border-black/5 p-3 flex flex-col gap-3 transition-all duration-200 ease-out ${
              open
                ? "opacity-100 scale-100 pointer-events-auto"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener"
                aria-label={link.label}
                className={`w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-md transition-all duration-200 ${link.className}`}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
