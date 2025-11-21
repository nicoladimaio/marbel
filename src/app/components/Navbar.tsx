"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navIcons } from "./navIcons";
import Image from "next/image";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/chi-siamo", label: "Chi Siamo" },
  { href: "/offerte", label: "Offerte" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/servizi", label: "Servizi" },
  { href: "/preventivo", label: "Preventivo" },
  { href: "/contatti", label: "Contatti" },
  { href: "/login", label: "Login" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 backdrop-blur ${
        scrolled
          ? "bg-white/95 shadow-lg border-b border-[#1a2a4e]/30"
          : "bg-white/70"
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Logo Mar.Bel."
            width={40}
            height={40}
            className="drop-shadow"
          />
        </div>
        {/* Desktop menu minimal: solo testo */}
        <ul className="hidden md:flex gap-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  aria-label={item.label}
                  tabIndex={0}
                  className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#1a2a4e] focus:ring-offset-2 focus:ring-offset-white
                    ${
                      isActive
                        ? "bg-[#1a2a4e]/10 text-[#1a2a4e] shadow"
                        : "text-[#3a4a5a] hover:text-[#274472] hover:bg-[#1a2a4e]/5"
                    }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#1a2a4e]"
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
            stroke="#1a2a4e"
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
      {/* Mobile menu */}
      {menuOpen && (
        <ul
          className="md:hidden flex flex-col gap-2 px-4 pb-4 animate-fade-in"
          role="menu"
        >
          {navItems.map((item) => {
            const Icon = navIcons[item.href as keyof typeof navIcons];
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  aria-label={item.label}
                  tabIndex={0}
                  className={`flex items-center gap-2 px-3 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#1a2a4e] focus:ring-offset-2 focus:ring-offset-white
                    ${
                      isActive
                        ? "bg-[#1a2a4e]/10 text-[#1a2a4e] shadow"
                        : "text-[#3a4a5a] hover:text-[#274472] hover:bg-[#1a2a4e]/5"
                    }`}
                >
                  {Icon && <Icon size={20} aria-hidden="true" />}
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="w-full bg-white border-t border-[#1a2a4e]/30 py-6 px-4 flex items-center justify-between font-sans">
      <div className="flex items-center gap-2">
        <Image
          src="/logo.png"
          alt="Logo"
          width={40}
          height={40}
          className="drop-shadow"
        />
        <span className="text-[#1a2a4e] font-bold text-lg">Mar.Bel.</span>
      </div>
      <div className="text-[#3a4a5a] text-sm">
        © {new Date().getFullYear()} Tutti i diritti riservati
      </div>
    </footer>
  );
}
