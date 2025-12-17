"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import RiderSidebar from "@/app/components/RiderSidebar";
import HeaderRider from "@/app/components/HeaderRider";

import styles from "./layout.module.css";

export default function RiderLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // ✅ Ocultar header+sidebar SOLO en delivery
  const hideUI = useMemo(() => pathname.startsWith("/rider/delivery"), [pathname]);

  const [userName, setUserName] = useState("Rider");
  const [completedToday, setCompletedToday] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const user = JSON.parse(raw);
        setUserName(user?.fullName ?? user?.name ?? "Rider");
      }
    } catch {
      setUserName("Rider");
    }

    // ⏳ luego: conectar a backend (delivered hoy)
    setCompletedToday(0);
  }, []);

  return (
    <div className={styles.wrapper}>
      {!hideUI && (
        <HeaderRider userName={userName} completedToday={completedToday} />
      )}

      <div className={styles.content}>
        {!hideUI && <RiderSidebar />}

        <main className={styles.pageContent}>{children}</main>
      </div>
    </div>
  );
}
