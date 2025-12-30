"use client";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* CookieBanner rimosso: ora solo in layout.tsx globale */}
      {children}
    </>
  );
}
