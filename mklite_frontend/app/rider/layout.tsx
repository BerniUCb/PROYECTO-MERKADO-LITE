"use client";

import { usePathname } from "next/navigation";
import RiderSidebar from "@/app/components/RiderSidebar";
import styles from "./layout.module.css";

export default function RiderLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideSidebar = pathname.startsWith("/rider/delivery");

  return (
    <div className={styles.riderLayout}>
      {!hideSidebar && <RiderSidebar />}
      <main className={styles.pageContent}>{children}</main>
    </div>
  );
}
