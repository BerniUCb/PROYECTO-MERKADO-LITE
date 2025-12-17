"use client";

import { usePathname } from "next/navigation";
import LayoutShell from "@/app/components/LayoutShell";

export default function RootChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // 🔴 Rider NO usa LayoutShell (para que no salga header cliente)
  if (pathname.startsWith("/rider")) {
    return <>{children}</>;
  }

  // ✅ El resto de la app sí usa LayoutShell
  return <LayoutShell>{children}</LayoutShell>;
}
