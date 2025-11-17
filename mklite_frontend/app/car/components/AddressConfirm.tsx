"use client";
import styles from "./modal.module.css";

export default function AddressConfirm({ address, onClose }: any) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modalSmall}>
        <h3>Confirmar envío</h3>
        <p>{address}</p>

        <button className={styles.primaryBtn} onClick={onClose}>
          Confirmar Envío
        </button>
      </div>
    </div>
  );
}
