"use client";

import styles from "./page.module.css";
import { notificationIcons } from "@/app/utils/notificationIcons";
import { HiOutlineBell } from "react-icons/hi";
import type { IconType } from "react-icons";

export default function NotificationDrivePage() {
  // ===============================
  // Iconos con fallback seguro
  // ===============================
  const OrderIcon: IconType =
    notificationIcons["ORDER_RECEIVED"] ?? HiOutlineBell;

  const MessageIcon: IconType =
    notificationIcons["MESSAGE"] ?? HiOutlineBell;

  const BoxIcon: IconType =
    notificationIcons["ORDER_SHIPPED"] ?? HiOutlineBell;

  const AlertIcon: IconType =
    notificationIcons["URGENT"] ?? HiOutlineBell;

  const ChatIcon: IconType =
    notificationIcons["MESSAGE"] ?? HiOutlineBell;

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Bienvenido Pepe</h1>

      <section className={styles.content}>
        {/* ================= NOTIFICACIONES ================= */}
        <div className={styles.notifications}>
          {/* ===== PEDIDO URGENTE ===== */}
          <div className={`${styles.notificationCard} ${styles.urgent}`}>
            <div className={styles.notificationInfo}>
              <strong className={styles.cardTitle}>
                {/* ICONO PEDIDO (NEGRO COMO EN LA IMAGEN) */}
                <OrderIcon size={18} />
                <span>Nuevo pedido asignado</span>
              </strong>

              <p>
                Tienes un nuevo pedido <b>#MKL-789456</b> listo para recoger en
                MERKADOLITE
              </p>

              <div className={styles.meta}>
                <span className={styles.time}>Hace 2 min</span>

                {/* BADGE URGENTE (ROJO) */}
                <span className={styles.badge}>
                  <AlertIcon size={14} />
                  Urgente
                </span>
              </div>
            </div>

            <button className={styles.primaryBtn}>Ver detalles</button>
          </div>

          {/* ===== MENSAJE CLIENTE ===== */}
          <div className={styles.notificationCard}>
            <div className={styles.notificationInfo}>
              <strong className={styles.cardTitle}>
                {/* ICONO MENSAJE (NEGRO) */}
                <MessageIcon size={18} />
                <span>Mensaje del cliente</span>
              </strong>

              <p>
                María González: “Por favor toque el timbre dos veces cuando
                llegue”
              </p>

              <span className={styles.time}>Hace 10 min</span>
            </div>
          </div>
        </div>

        {/* ================= RESUMEN ================= */}
        <div className={styles.stats}>
          {/* PEDIDOS NUEVOS  */}
          <div className={styles.statCard}>
            <span className={`${styles.icon} ${styles.iconBlue}`}>
              <BoxIcon size={18} />
            </span>
            <div>
              <small>Pedidos Nuevos</small>
              <strong>1</strong>
            </div>
          </div>

          {/* URGENTES */}
          <div className={styles.statCard}>
            <span className={`${styles.icon} ${styles.iconRed}`}>
              <AlertIcon size={18} />
            </span>
            <div>
              <small>Urgentes</small>
              <strong>2</strong>
            </div>
          </div>

          {/* MENSAJES */}
          <div className={styles.statCard}>
            <span className={`${styles.icon} ${styles.iconPurple}`}>
              <ChatIcon size={18} />
            </span>
            <div>
              <small>Mensajes</small>
              <strong>1</strong>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
