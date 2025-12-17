"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { notificationIcons } from "@/app/utils/notificationIcons";
import { HiOutlineBell } from "react-icons/hi";
import type { IconType } from "react-icons";
import notificationService from "@/app/services/notification.service";
import type Notification from "@/app/models/notification.model";

export default function NotificationDrivePage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const all = await notificationService.getDriverNotifications();
        const unread = await notificationService.getUnreadDriverNotifications();

        setNotifications(all);
        setUnreadCount(unread.length);
      } catch (error) {
        console.error("Error al cargar notificaciones del repartidor", error);
      }
    };

    loadNotifications();
  }, []);

  // ===============================
  // Iconos con fallback seguro
  // ===============================
  const getIcon = (type: string): IconType =>
    notificationIcons[type] ?? HiOutlineBell;

  const urgentCount = notifications.filter(
    (n) => n.type === "ORDER_RECEIVED"
  ).length;

  const messageCount = notifications.filter(
    (n) => n.type === "NEW_PROMOTION"
  ).length;

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Bienvenido Pepe</h1>

      {notifications.length === 0 && (
        <p className={styles.empty}>No tienes notificaciones aún</p>
      )}

      <section className={styles.content}>
        {/* ================= NOTIFICACIONES ================= */}
        <div className={styles.notifications}>
          {notifications.map((notif) => {
            const Icon = getIcon(notif.type);

            return (
              <div
                key={notif.id}
                className={`${styles.notificationCard} ${
                  !notif.isRead ? styles.urgent : ""
                }`}
              >
                <div className={styles.notificationInfo}>
                  <strong className={styles.cardTitle}>
                    <Icon size={18} />
                    <span>{notif.title}</span>
                  </strong>

                  <p>{notif.detail}</p>

                  <div className={styles.meta}>
                    <span className={styles.time}>
                      {new Date(notif.createdAt).toLocaleString()}
                    </span>

                    {!notif.isRead && (
                      <span className={styles.badge}>Nuevo</span>
                    )}
                  </div>
                </div>

                <button className={styles.primaryBtn}>Ver detalles</button>
              </div>
            );
          })}
        </div>

        {/* ================= RESUMEN ================= */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={`${styles.icon} ${styles.iconBlue}`}>
              <HiOutlineBell size={18} />
            </span>
            <div>
              <small>Pedidos Nuevos</small>
              <strong>{notifications.length}</strong>
            </div>
          </div>

          <div className={styles.statCard}>
            <span className={`${styles.icon} ${styles.iconRed}`}>
              <HiOutlineBell size={18} />
            </span>
            <div>
              <small>Urgentes</small>
              <strong>{urgentCount}</strong>
            </div>
          </div>

          <div className={styles.statCard}>
            <span className={`${styles.icon} ${styles.iconPurple}`}>
              <HiOutlineBell size={18} />
            </span>
            <div>
              <small>Mensajes</small>
              <strong>{messageCount}</strong>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
