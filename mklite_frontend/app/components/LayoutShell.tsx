"use client";

import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

import Header from "./Header";
import HeaderAdmin from "./HeaderAdmin";
import Footer from "./Footer";
import RiderModal from "./RiderModal";
import styles from "./LayoutShell.module.css";

export default function LayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isAdminRoute = pathname.startsWith("/admin");

  // Rutas sin Header/Footer/Modal
  const noChromeRoutes = ["/"]; // 👈 la página raíz
  const isNoChromeRoute = noChromeRoutes.includes(pathname);

  const [showRiderModal, setShowRiderModal] = useState(false);

  // 👉 En estas rutas NO renderizamos layout (ni header, ni footer)
  if (isNoChromeRoute) {
    return <>{children}</>;
  }

  // 👉 Resto de rutas normales
  return (
    <>
      <div className={showRiderModal ? styles.blurred : ""}>
        {isAdminRoute ? <HeaderAdmin /> : <Header />}

        <main style={{ minHeight: "80vh" }}>{children}</main>

        {!isAdminRoute && (
          <Footer onOpenRiderModal={() => setShowRiderModal(true)} />
        )}
      </div>

      {showRiderModal && (
        <RiderModal onClose={() => setShowRiderModal(false)} />
      )}
    </>
  );
}
