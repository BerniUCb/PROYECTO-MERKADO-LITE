"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { Pencil } from "lucide-react";
import { UserService } from "@/app/services/user.service";
import UserSidebar from "@/app/components/UserSidebar";

export default function AccountDetailsPage() {
  const userId = 1; // temporal hasta login

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    UserService.getById(userId).then((data) => setUser(data));
  }, []);

  if (!user) return <p>Cargando...</p>;

  return (
    <main className={styles.wrapper}>
      {/* Sidebar */}
      {/*<UserSidebar />*/}

      {/* Contenido derecha */}
      <div className={styles.container}>
        <h2 className={styles.title}>Detalles de la cuenta</h2>

        {/* Nombre completo */}
        <div className={styles.row}>
          <div>
            <p className={styles.label}>Nombre Completo</p>
            <p className={styles.value}>{user.fullName}</p>
          </div>
          <button className={styles.editBtn}>
            <Pencil size={16} /> Editar
          </button>
        </div>

        {/* Teléfono */}
        <div className={styles.row}>
          <div>
            <p className={styles.label}>Número de Teléfono</p>
            <p className={styles.value}>{user.phone || "No registrado"}</p>
          </div>
          <button className={styles.editBtn}>
            <Pencil size={16} /> Editar
          </button>
        </div>

        {/* Correo */}
        <div className={styles.row}>
          <div>
            <p className={styles.label}>Correo Electrónico</p>
            <p className={styles.value}>{user.email}</p>
          </div>
          <button className={styles.editBtn}>
            <Pencil size={16} /> Editar
          </button>
        </div>

      </div>
    </main>
  );
}
