"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navIcons } from "./navIcons";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/chi-siamo", label: "Chi Siamo" },
  { href: "/offerte", label: "Offerte" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/servizi", label: "Servizi" },
  { href: "/preventivo", label: "Preventivo" },
  { href: "/contatti", label: "Contatti" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleNavClick = () => setMenuOpen(false);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 backdrop-blur-md ${
        scrolled
          ? "bg-white/95 shadow-lg border-b border-[#317614]/30"
          : "bg-white/70"
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="w-full flex items-center justify-between px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24 h-20">
        <div className="flex-shrink-0">
          <Link href="/" aria-label="Logo MarBel">
            <Image
              src="/logo.png"
              alt="Logo MarBel"
              width={90}
              height={90}
              className="drop-shadow"
            />
          </Link>
        </div>

        <ul className="hidden md:flex items-center justify-end gap-6 2xl:gap-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  aria-label={item.label}
                  tabIndex={0}
                  className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#317614] focus:ring-offset-2 focus:ring-offset-white ${
                    isActive
                      ? "bg-[#317614]/10 text-[#317614] shadow"
                      : "text-[#3a4a5a] hover:text-[#274472] hover:bg-[#317614]/5"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          className="md:hidden ml-auto p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#317614] z-[60]"
          aria-label={menuOpen ? "Chiudi menu" : "Apri menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <svg
            width="28"
            height="28"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#317614"
            aria-hidden="true"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8h16M4 16h16"
              />
            )}
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-50 md:hidden bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-0 left-0 w-full bg-white rounded-b-2xl shadow-2xl p-6 pt-16 overflow-y-auto max-h-[100dvh]"
              onClick={(e) => e.stopPropagation()}
            >
              <ul className="flex flex-col gap-3" role="menu">
                {navItems.map((item) => {
                  const Icon = navIcons[item.href as keyof typeof navIcons];
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        aria-label={item.label}
                        onClick={handleNavClick}
                        tabIndex={0}
                        className={`flex items-center gap-3 px-3 py-3 rounded-lg font-semibold text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#317614] focus:ring-offset-2 focus:ring-offset-white ${
                          isActive
                            ? "bg-[#317614]/10 text-[#317614] shadow"
                            : "text-[#317614] hover:text-[#223867] hover:bg-[#317614]/5"
                        }`}
                      >
                        {Icon && <Icon size={20} aria-hidden="true" />}
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="w-full bg-white border-t border-[#317614]/30 py-6 px-4 flex items-center justify-between font-sans">
      <div className="flex items-center gap-2">
        <Image
          src="/logo.png"
          alt="Logo"
          width={90}
          height={90}
          className="drop-shadow"
        />
        <span className="text-[#317614] font-bold text-lg">Mar.Bel.</span>
      </div>
      <div className="text-[#3a4a5a] text-sm">
        ЖИ {new Date().getFullYear()} Tutti i diritti riservati
      </div>
    </footer>
  );
}
