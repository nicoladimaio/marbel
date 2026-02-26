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
      className={`relative w-full ${height} flex items-center justify-center pt-[80px] sm:pt-[64px] lg:pt-[80px] 2xl:pt-[64px] hero-generic-mobile-landscape`}
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
        className="relative z-10 w-full max-w-[96rem] mx-auto text-center px-4 sm:px-6 lg:px-8 2xl:px-10 space-y-3 text-white"
      >
        <div className="text-center space-y-3 text-white">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className={`break-words whitespace-pre-line text-2xl xs:text-3xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-extrabold uppercase translate-y-6${
              title === "CONTATTACI"
                ? " tracking-[0.12em] sm:tracking-[0.25em]"
                : " tracking-[0.18em] sm:tracking-[0.35em]"
            } max-w-full w-full mx-auto`}
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
              className="break-words whitespace-pre-line text-base xs:text-lg sm:text-xl lg:text-2xl text-white/85 translate-y-6 max-w-full w-full mx-auto"
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
