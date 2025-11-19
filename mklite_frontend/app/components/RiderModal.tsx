"use client";

import styles from "./RiderModal.module.css";

interface RiderModalProps {
  onClose: () => void;
  onContinue?: () => void;
}

export default function RiderModal({ onClose, onContinue }: RiderModalProps) {
  const handleContinue = () => {
    if (onContinue) onContinue();
    else onClose(); // por ahora solo cierra
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Botón cerrar (X) */}
        <button
          type="button"
          className={styles.closeButton}
          aria-label="Cerrar"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className={styles.title}>Quiero ser rider de Merkado Lite</h2>

        <p className={styles.text}>
          Si quieres ser un rider en Merkado Lite solo tienes que crear tu
          perfil y llenarlo con tus datos para empezar a hacer pedidos.
        </p>

        <button
          type="button"
          className={styles.continueButton}
          onClick={handleContinue}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
