import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";

import LayoutShell from "./components/LayoutShell"; // 👈 IMPORTANTE

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Merkado Lite",
  description: "Tu mercado de confianza",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={quicksand.className}>
        {/* Aquí vuelve tu sistema de headers/footers */}
        <LayoutShell>
          {children}
        </LayoutShell>
      </body>
    </html>
  );
}
