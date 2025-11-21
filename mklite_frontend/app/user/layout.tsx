// mklite_frontend/app/user/layout.tsx
import type { ReactNode } from "react";
import UserSidebar from "../components/UserSidebar";
import styles from "./UserLayout.module.css";

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.container}>
      {/* Menú lateral reutilizable */}
      <UserSidebar userName="Juan Pablo" />

      {/* Contenido específico de cada página de /user */}
      <section className={styles.content}>
        {children}
      </section>
    </div>
  );
}
