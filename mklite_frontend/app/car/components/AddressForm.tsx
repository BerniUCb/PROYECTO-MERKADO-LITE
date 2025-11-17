"use client";
import styles from "./modal.module.css";

export default function AddressForm({ onSave, onClose }: any) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>

        <h3>Ingresa la dirección de entrega</h3>

        <form className={styles.form} onSubmit={onSave}>
          <label>Dirección:</label>
          <input type="text" required />

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
