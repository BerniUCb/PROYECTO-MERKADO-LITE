"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { UserService } from "@/app/services/user.service";

export default function UserDetailPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Campos para el modal
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Client");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      const data = await UserService.getAll(1, 50);
      setUsers(data);
    } catch (error) {
      console.error("ERROR CARGANDO USUARIOS:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // ELIMINAR
  const handleDelete = async (id: number, name: string) => {
    const confirmed = window.confirm(
      `¿Estás seguro de eliminar al usuario "${name}"?`
    );

    if (!confirmed) return;

    try {
      await UserService.delete(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      alert("Usuario eliminado correctamente.");
    } catch (error) {
      alert("Error al eliminar usuario.");
    }
  };

  // CREAR USUARIO
  const handleCreateUser = async (e: any) => {
    e.preventDefault();
    setError("");

    try {
      await UserService.create({
        fullName,
        email,
        password,
        role,
        //city,
        phone,
      });

      // limpiar
      setFullName("");
      setEmail("");
      setPassword("");
      setRole("Client");
      setCity("");
      setPhone("");

      setShowModal(false);
      loadUsers();
      alert("Usuario creado correctamente.");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al crear usuario");
    }
  };

  if (loading) return <p>Cargando usuarios...</p>;

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2 className={styles.title}>Gestión de Usuarios</h2>

          <button
            className={styles.addButton}
            onClick={() => setShowModal(true)}
          >
            + Agregar Usuario
          </button>
        </div>

        {/* TABLA */}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.emptyMessage}>
                  No hay usuarios registrados.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.fullName}</td>
                  <td>{u.email}</td>
                  <td className={styles.role}>{u.role}</td>
                  <td>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(u.id, u.fullName)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ⭐ MODAL PARA CREAR USUARIO ⭐ */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button
              className={styles.closeButton}
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>

            <h2 className={styles.modalTitle}>Agregar Usuario</h2>

            <form className={styles.form} onSubmit={handleCreateUser}>
              <label>Nombre completo</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />

              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label>Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <label>Ciudad</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />

              <label>Teléfono</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <label>Rol</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="Client">Cliente</option>
                <option value="Seller">Vendedor</option>
                <option value="Warehouse">Almacén</option>
                <option value="DeliveryDriver">Repartidor</option>
                <option value="Admin">Administrador</option>
                <option value="Support">Soporte</option>
                <option value="Supplier">Proveedor</option>
              </select>

              {error && <p className={styles.error}>{error}</p>}

              <button type="submit" className={styles.modalButton}>
                Crear Usuario
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
