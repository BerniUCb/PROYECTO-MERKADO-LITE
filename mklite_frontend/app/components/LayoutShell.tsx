"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import HeaderAdmin from "./HeaderAdmin";
import Footer from "./Footer";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // true si estamos en /admin o /admin/lo-que-sea
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <>
      {isAdminRoute ? <HeaderAdmin /> : <Header />}

      <main style={{ minHeight: "80vh" }}>{children}</main>

      {/* Para admin NO mostramos footer de tienda */}
      <Footer />
    </>
  );
}
