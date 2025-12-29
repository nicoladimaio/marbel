"use client";
import CookieBanner from "../components/CookieBanner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CookieBanner />
      {children}
    </>
  );
}
