"use client";
import styles from "./modal.module.css";

export default function AddressEmpty({
  onAdd,
  onClose,
}: {
  onAdd: () => void;
  onClose: () => void;
}) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        
        <button className={styles.closeBtn} onClick={onClose}>×</button>

        <h3>Direcciones de envío.</h3>
        <p>No tienes direcciones registradas, agrega una ahora.</p>

        <button className={styles.primaryBtn} onClick={onAdd}>
          Añadir mi Dirección Ahora
        </button>
      </div>
    </div>
  );
}
