"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, cubicBezier } from "framer-motion";
import { servicesList } from "../../data/services";

export default function ServiceCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const updateScrollState = () => {
    const track = trackRef.current;
    if (!track) return;

    const { scrollLeft, scrollWidth, clientWidth } = track;

    const atStart = scrollLeft <= 1;
    const atEnd = scrollLeft + clientWidth >= scrollWidth - 1;

    setIsAtStart(atStart);
    setIsAtEnd(atEnd);

    // Aggiorna activeIndex su mobile
    const cardWidth =
      track.querySelector("[data-service-card]")?.clientWidth || clientWidth;
    const idx = Math.round(scrollLeft / (cardWidth + 24)); // 24 = gap-6
    setActiveIndex(idx);
  };

  const scrollBy = (direction: "prev" | "next") => {
    const track = trackRef.current;
    if (!track) return;

    const firstCard = track.querySelector(
      "[data-service-card]",
    ) as HTMLElement | null;

    const styles = getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;

    const cardWidth = (firstCard?.offsetWidth ?? track.clientWidth / 4) + gap;

    track.scrollBy({
      left: direction === "next" ? cardWidth : -cardWidth,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    updateScrollState();
    const track = trackRef.current;
    if (!track) return;
    const handleScroll = () => updateScrollState();
    track.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    return () => {
      track.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <div className="space-y-5">
      <div className="relative overflow-visible pt-8">
        {/* Gradienti laterali mobile */}
        <div
          ref={trackRef}
          className="flex gap-6 overflow-x-auto overflow-y-hidden pb-4 pt-8 px-2 sm:px-0 snap-x snap-mandatory touch-pan-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {servicesList.map(
            ({ key, title, description, icon: Icon, href }, i) => (
              <motion.div
                key={key}
                data-service-card
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.05,
                  ease: cubicBezier(0.22, 1, 0.36, 1),
                }}
                whileHover={{ y: -8, zIndex: 20 }}
                className="snap-center w-[90vw] min-w-[90vw] sm:snap-start sm:w-[340px] sm:min-w-[320px] rounded-2xl border border-[#e5e7eb] bg-white/90 p-7 shadow-lg shadow-[#0b152e]/10 flex flex-col justify-between transition-all service-card-landscape"
              >
                <div className="flex flex-col gap-5">
                  <div className="w-14 h-14 rounded-full bg-white text-[#1E2A22] flex items-center justify-center shadow-md">
                    <Icon size={26} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold uppercase tracking-[0.35em] text-[#1E2A22]">
                      {title}
                    </h3>
                    <p className="text-sm text-[#475569] leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
                <Link
                  href={href}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-[#1E2A22] hover:text-[#317614] transition-colors"
                >
                  Scopri di più
                </Link>
              </motion.div>
            ),
          )}
        </div>
        {/* Dots indicator mobile */}
        <div className="flex justify-center gap-2 mt-2 sm:hidden">
          {servicesList.map((_, i) => (
            <span
              key={i}
              className={`block w-2 h-2 rounded-full transition-all duration-300 ${
                i === activeIndex ? "bg-white" : "bg-white/45"
              }`}
            />
          ))}
        </div>
      </div>
      <div className="hidden sm:flex justify-center gap-3">
        <button
          type="button"
          onClick={() => scrollBy("prev")}
          disabled={isAtStart}
          className={`w-10 h-10 rounded-full bg-white shadow-md border border-[#e2e8f0] text-[#1E2A22] font-bold transition ${
            !isAtStart ? "hover:bg-[#f5f6fa]" : "opacity-40 cursor-not-allowed"
          }`}
          aria-label="Servizi precedenti"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => scrollBy("next")}
          disabled={isAtEnd}
          className={`w-10 h-10 rounded-full bg-white shadow-md border border-[#e2e8f0] text-[#1E2A22] font-bold transition ${
            !isAtEnd ? "hover:bg-[#f5f6fa]" : "opacity-40 cursor-not-allowed"
          }`}
          aria-label="Servizi successivi"
        >
          →
        </button>
      </div>
    </div>
  );
}
