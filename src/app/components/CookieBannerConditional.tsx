"use client";
import CookieBanner from "./CookieBanner";
import { usePathname } from "next/navigation";

export default function CookieBannerConditional() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <CookieBanner />;
}
