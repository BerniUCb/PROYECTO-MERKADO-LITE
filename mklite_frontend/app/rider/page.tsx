"use client";

import styles from "./page.module.css";

export default function RiderHomePage() {
  const riderName = "Pepe"; // aquí luego lo traes de tu auth/usuario

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Bienvenido {riderName}</h1>

      <section className={styles.content}>
        <div className={styles.card}>
          <header className={styles.cardHeader}>
            <span className={styles.cardTitle}>Pedidos disponibles</span>
          </header>

          <div className={styles.cardBody}>
            <p className={styles.emptyText}>
              Aquí verás tus pedidos disponibles cuando el backend esté
              conectado.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
