"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Para redirigir si no hay sesión
import styles from "./page.module.css";
import { UserService } from "@/app/services/user.service";
import UserSidebar from "@/app/components/UserSidebar";
import type User from "@/app/models/user.model"; // Importamos el modelo correcto

export default function AccountDetailsPage() {
  const router = useRouter();
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Obtener el usuario guardado en localStorage
    const storedUser = localStorage.getItem("user");
    
    if (!storedUser) {
      // Si no hay sesión, redirigir al login
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      const userId = parsedUser.id;

      if (userId) {
        // 2. Obtener datos frescos del backend usando el ID real
        UserService.getById(userId)
          .then((data) => {
            setUser(data);
          })
          .catch((err) => {
            console.error("Error cargando usuario:", err);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    } catch (error) {
      console.error("Error al leer sesión:", error);
      setLoading(false);
    }
  }, [router]);

  if (loading) return <p style={{padding: "2rem", textAlign: "center"}}>Cargando perfil...</p>;
  if (!user) return <p style={{padding: "2rem", textAlign: "center"}}>No se encontraron datos del usuario.</p>;

  return (
    <div className={styles.wrapper}>
      {/* Sidebar (Descomentar cuando lo integres) */}
      {/*<UserSidebar /> */}

      {/* Contenido derecha */}
      <div className={styles.container}>
        <h2 className={styles.title}>Detalles de la cuenta</h2>

        {/* Nombre completo */}
        <div className={styles.row}>
          <div>
            <p className={styles.label}>Nombre Completo</p>
            <p className={styles.value}>{user.fullName}</p>
          </div>
        </div>

        {/* Teléfono */}
        <div className={styles.row}>
          <div>
            <p className={styles.label}>Número de Teléfono</p>
            <p className={styles.value}>{user.phone || "No registrado"}</p>
          </div>
        </div>

        {/* Correo */}
        <div className={styles.row}>
          <div>
            <p className={styles.label}>Correo Electrónico</p>
            <p className={styles.value}>{user.email}</p>
          </div>
        </div>
        
        {/* Rol (Opcional, útil para debug) */}
         <div className={styles.row}>
          <div>
            <p className={styles.label}>Tipo de Cuenta</p>
            <p className={styles.value} style={{textTransform: 'capitalize'}}>{user.role}</p>
          </div>
        </div>

      </div>
    </div>
  );
}