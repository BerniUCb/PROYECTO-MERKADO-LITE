"use client";

import Image from "next/image";
import styles from "./HeaderRider.module.css";

type Props = {
  userName: string;
  completedToday: number;
};

export default function HeaderRider({ userName, completedToday }: Props) {
  return (
    <header className={styles.header}>
      {/* IZQUIERDA: LOGO */}
      <div className={styles.left}>
        <Image
          src="/header/logoMKLite.png"
          alt="Merkado Lite"
          width={220}
          height={70}
          priority
        />
      </div>

      {/* DERECHA: INFO RIDER */}
      <div className={styles.right}>
        <div className={styles.stats}>
          <span className={styles.label}>Pedidos realizados hoy</span>
          <span className={styles.value}>{completedToday}</span>
        </div>

        <div className={styles.riderInfo}>
          <Image
            src="/admin-menu/truck-fast.svg" // usa el icono que ya tengas
            alt="Rider"
            width={28}
            height={28}
          />
          <div className={styles.riderText}>
            <span className={styles.dashboard}>Rider Dashboard</span>
            <span className={styles.name}>{userName}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
