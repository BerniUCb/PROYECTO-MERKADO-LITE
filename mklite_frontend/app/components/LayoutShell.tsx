"use client";

import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

import Header from "./Header";
import HeaderAdmin from "./HeaderAdmin";
import Footer from "./Footer";
import RiderModal from "./RiderModal";
import styles from "./LayoutShell.module.css";

export default function LayoutShell({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  const [showRiderModal, setShowRiderModal] = useState(false);

  return (
    <>
      {/* TODO LO QUE SE VA A BLUREAR */}
      <div className={showRiderModal ? styles.blurred : ""}>
        {isAdminRoute ? <HeaderAdmin /> : <Header />}

        <main style={{ minHeight: "80vh" }}>{children}</main>

        {/* Footer solo para usuario */}
        {!isAdminRoute && (
          <Footer onOpenRiderModal={() => setShowRiderModal(true)} />
        )}
      </div>

      {/* Modal Rider (NO se blurea) */}
      {showRiderModal && (
        <RiderModal onClose={() => setShowRiderModal(false)} />
      )}
    </>
  );
}
