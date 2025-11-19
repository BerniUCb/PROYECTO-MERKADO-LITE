"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

import Header from "./Header";
import HeaderAdmin from "./HeaderAdmin";
import Footer from "./Footer";
import RiderModal from "./RiderModal"; // este componente lo puedes crear igual al que te pasé

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  const [showRiderModal, setShowRiderModal] = useState(false);

  return (
    <>
      {isAdminRoute ? <HeaderAdmin /> : <Header />}

      <main style={{ minHeight: "80vh" }}>{children}</main>

      {/* Footer solo para usuario */}
      {!isAdminRoute && (
        <Footer onOpenRiderModal={() => setShowRiderModal(true)} />
      )}

      {/* Modal Rider */}
      {showRiderModal && (
        <RiderModal onClose={() => setShowRiderModal(false)} />
      )}
    </>
  );
}
