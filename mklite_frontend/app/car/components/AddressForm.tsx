"use client";
import { useState } from "react";
import styles from "./modal.module.css";

export default function AddressForm({
  onSave,
  onClose,
}: {
  onSave: (address: string) => void;
  onClose: () => void;
}) {
  const [address, setAddress] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(address);      // envío la dirección
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>

        <h3>Ingresa la dirección de entrega</h3>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label>Dirección:</label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <div className={styles.row}>
            <div>
              <label>Número</label>
              <input type="text" required />
            </div>
            <div>
              <label>Ciudad</label>
              <input type="text" required />
            </div>
          </div>

          <label>Referencia</label>
          <input type="text" />

          <button type="submit" className={styles.primaryBtn}>
            Guardar Dirección
          </button>
        </form>
      </div>
    </div>
  );
}
