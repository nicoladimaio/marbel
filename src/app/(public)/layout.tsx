import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* CookieBanner rimosso: ora solo in layout.tsx globale */}
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
