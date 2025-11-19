"use client";
import styles from "./modal.module.css";

export default function AddressList({ addresses, onSelect, onAdd, onClose }: any) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>

        <h3>Direcciones de envío</h3>

        <div className={styles.addressList}>
          {addresses.map((a: any, i: number) => (
            <div key={i} className={styles.addressItem} onClick={() => onSelect(a)}>
              {a}
            </div>
          ))}
        </div>

        <button className={styles.addLink} onClick={onAdd}>+ Añadir dirección</button>
        <button className={styles.primaryBtn} onClick={onClose}>Continuar</button>
      </div>
    </div>
  );
}
