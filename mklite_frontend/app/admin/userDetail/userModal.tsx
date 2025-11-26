"use client";

import { useState } from "react";
//import styles from "./modal.module.css";
import styles from "./page.module.css";
import { UserService } from "@/app/services/user.service";
import { UserRole } from "@/app/models/user.model";

export default function AddUserModal({ onClose, onCreated }: any) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("Client");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await UserService.create({
      fullName,
      email,
      phone,
      password,
      role,
    });

    onCreated();
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Agregar Usuario</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label>Nombre Completo</label>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} required />

          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label>Teléfono</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} />

          <label>Contraseña</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <label>Rol</label>
          <select value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
            <option value="Client">Cliente</option>
            <option value="Administrator">Administrador</option>
            <option value="Sales">Ventas</option>
            <option value="Warehouse">Almacén</option>
            <option value="DeliveryDriver">Repartidor</option>
            <option value="Support">Soporte</option>
            <option value="Supplier">Proveedor</option>
          </select>

          <button className={styles.saveBtn} type="submit">Guardar Usuario</button>
          <button className={styles.cancelBtn} type="button" onClick={onClose}>Cancelar</button>
        </form>
      </div>
    </div>
  );
}
