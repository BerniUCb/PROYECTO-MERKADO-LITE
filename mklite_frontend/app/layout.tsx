import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import LayoutShell from "./components/LayoutShell"; // ✅

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
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
