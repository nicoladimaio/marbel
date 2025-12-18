"use client";
import Image from "next/image";
import { motion } from "framer-motion";

type HeroProps = {
  image: string;
  title: string;
  subtitle?: string;
  height?: string;
  darkness?: number;
  centerImage?: boolean;
};

export default function Hero({
  image,
  title,
  subtitle,
  height = "min-h-[40vh]",
  darkness = 60,
  centerImage = true,
}: HeroProps) {
  const darknessValue = Math.min(Math.max(darkness, 0), 100);
  const imageClass = centerImage
    ? "object-cover object-center"
    : "object-cover object-top";

  return (
    <section
      className={`relative w-full ${height} flex items-center justify-center pt-[80px] sm:pt-0 hero-generic-mobile-landscape`}
    >
      <motion.div className="absolute inset-0">
        <Image
          src={image}
          alt={title}
          fill
          priority
          sizes="100vw"
          className={imageClass}
        />
      </motion.div>

      <div
        className={`absolute inset-0 bg-black/${darknessValue}`}
        style={{
          backgroundColor: `rgba(12, 19, 38, ${darknessValue / 100})`,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 text-center px-6 space-y-3 text-white"
      >
        <div className="text-center space-y-3 text-white">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className={`text-4xl sm:text-5xl font-extrabold uppercase translate-y-6${
              title === "CONTATTACI"
                ? " tracking-[0.25em]"
                : " tracking-[0.35em]"
            }`}
          >
            {title}
          </motion.h1>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.8,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-lg sm:text-xl text-white/85 translate-y-6"
            >
              {subtitle}
            </motion.p>
          )}

          <span className="inline-block h-px w-16 bg-white/70 translate-y-6" />
        </div>
      </motion.div>
    </section>
  );
}
