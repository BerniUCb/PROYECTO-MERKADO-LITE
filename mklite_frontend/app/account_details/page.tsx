"use client";
import styles from "./page.module.css";


export default function AccountDetails() {
  return (
    <main className={styles.container}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <h3 className={styles.username}>Pepe</h3>

        <ul className={styles.menu}>
          <li className={styles.active}>🏦 Detalles de la Cuenta</li>
          <li>📦 Mis Pedidos</li>
          <li>🛒 Mi Carrito</li>
          <li>📍 Mis Direcciones</li>
          <li>🔔 Notificaciones</li>
          <li>🎟️ Cupones</li>
          <li>🧾 Recibos</li>
          <li>⚙️ Configuración de la cuenta</li>
        </ul>

        <button className={styles.logout}>⏻ Cerrar Sesión</button>
      </aside>

      {/* Detalles */}
      <section className={styles.details}>
        <h2 className={styles.title}>Detalles de la cuenta</h2>

        <div className={styles.card}>
          <span className={styles.label}>Nombre Completo</span>
          <span className={styles.value}>el pepe</span>
          {/*<button className={styles.edit}>✏️ Editar</button>*/}
        </div>

        <div className={styles.card}>
          <span className={styles.label}>Número de Teléfono</span>
          <span className={styles.value}>+591 69500024</span>
           {/*<button className={styles.edit}>✏️ Editar</button>*/}
        </div>

        <div className={styles.card}>
          <span className={styles.label}>Correo Electrónico</span>
          <span className={styles.value}>pepe2025@gmail.com</span>
          {/*<button className={styles.edit}>✏️ Editar</button>*/}
        </div>
      </section>
    </main>
  );
}
