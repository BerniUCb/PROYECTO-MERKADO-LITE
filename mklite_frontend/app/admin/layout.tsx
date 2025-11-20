import type { ReactNode } from "react";
import AdminSidebar from "../components/AdminSidebar";
import styles from "./AdminLayout.module.css";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.container}>
      <AdminSidebar />
      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}
