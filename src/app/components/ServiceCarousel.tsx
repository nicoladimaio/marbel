"use client";
import Link from "next/link";
import { useRef } from "react";
import { motion } from "framer-motion";
import { cubicBezier } from "framer-motion";
import { servicesList } from "../../data/services";

export default function ServiceCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (direction: "prev" | "next") => {
    if (!trackRef.current) return;
    const cardWidth = 320;
    trackRef.current.scrollBy({
      left: direction === "next" ? cardWidth : -cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <div className="space-y-5">
      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto pb-4 -mx-1 px-1 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {servicesList.map(
          ({ key, title, description, icon: Icon, href }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.6,
                delay: i * 0.05,
                ease: cubicBezier(0.22, 1, 0.36, 1),
              }}
              whileHover={{ y: -8 }}
              className="snap-center min-w-[300px] sm:min-w-[320px] rounded-2xl border border-[#e5e7eb] bg-white/90 p-7 shadow-lg shadow-[#0b152e]/10 flex flex-col justify-between"
            >
              <div className="flex flex-col gap-5">
                <div className="w-14 h-14 rounded-full bg-white text-[#1a2a4e] flex items-center justify-center shadow-md">
                  <Icon size={26} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold uppercase tracking-[0.35em] text-[#1a2a4e]">
                    {title}
                  </h3>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
              <Link
                href={href}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-[#1a2a4e] hover:text-[#102046] transition-colors"
              >
                Scopri di più →
              </Link>
            </motion.div>
          )
        )}
      </div>
      <div className="flex justify-center gap-3">
        <button
          type="button"
          onClick={() => scrollBy("prev")}
          className="w-10 h-10 rounded-full bg-white shadow-md border border-[#e2e8f0] text-[#1a2a4e] font-bold hover:bg-[#f5f6fa] transition"
          aria-label="Servizi precedenti"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => scrollBy("next")}
          className="w-10 h-10 rounded-full bg-white shadow-md border border-[#e2e8f0] text-[#1a2a4e] font-bold hover:bg-[#f5f6fa] transition"
          aria-label="Servizi successivi"
        >
          ›
        </button>
      </div>
    </div>
  );
}
