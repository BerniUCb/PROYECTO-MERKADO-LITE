"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import type UserModel from "../models/user.model";
// import { createUser, deleteUser, getUsers } from "../services/user.service";

export default function UsuarioPage() {
  const [users, setUsers] = useState<UserModel[]>([]);

  // Cuando conectes el backend, puedes descomentar esto:
  /*
  useEffect(() => {
    async function fetchUsers() {
      const data = await getUsers();
      setUsers(data);
    }
    fetchUsers();
  }, []);
  */

  return (
    <div className={styles.user_page}>
      <h1 className={styles.user_title}>Panel de Usuario</h1>

      <div className={styles.user_container}>
        {users.length === 0 && <p>No hay usuarios cargados todavía.</p>}

        {users.map((user) => (
          <div className={styles.user_card} key={user.id}>
            <h2 className={styles.user_data}>
              Usuario: {user.nombreCompleto}
            </h2>
            <p>Email: {user.email}</p>
            <p>Rol: {user.rol}</p>
            <p>Estado: {user.isActive ? "Activo" : "Inactivo"}</p>

            {/* Cuando vuelvas a activar backend */}
            {/*
            <button
              className={styles.user_card_delete_button}
              onClick={() => deleteUser(user.id)}
            >
              Eliminar
            </button>
            */}
          </div>
        ))}
      </div>
    </div>
  );
}
