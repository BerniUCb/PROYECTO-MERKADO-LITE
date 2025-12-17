"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import {
  HiOutlineBell,
  HiOutlineTruck,
  HiOutlineExclamation,
  HiOutlineChatAlt2,
} from "react-icons/hi";
import type { IconType } from "react-icons";

import notificationService from "@/app/services/notification.service";
import type Notification from "@/app/models/notification.model";

export default function NotificationDrivePage() {
  const router = useRouter();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // ===============================
  // CARGA DE NOTIFICACIONES
  // ===============================
  const loadNotifications = async () => {
    try {
      setLoading(true);

      const all = await notificationService.getDriverNotifications();
      const unread =
        await notificationService.getUnreadDriverNotifications();

      setNotifications(all);
      setUnreadCount(unread.length);
    } catch (error) {
      console.error("Error al cargar notificaciones del repartidor", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // ===============================
  // CATEGORÍAS
  // ===============================
  const isNewOrder = (type: string) => type === "ORDER_RECEIVED";
  const isUrgentOrder = (type: string) => type === "ORDER_SHIPPED";
  const isMessage = (type: string) => type === "NEW_PROMOTION";

  // ===============================
  // ICONOS POR CATEGORÍA
  // ===============================
  const getIconByType = (type: string): IconType => {
    if (isNewOrder(type)) return HiOutlineTruck;
    if (isUrgentOrder(type)) return HiOutlineExclamation;
    if (isMessage(type)) return HiOutlineChatAlt2;
    return HiOutlineBell;
  };

  // ===============================
  // VER DETALLES + MARCAR COMO LEÍDO
  // ===============================
  const handleViewDetails = async (notif: Notification) => {
    try {
      if (!notif.isRead) {
        await notificationService.markAsRead(notif.id);
      }

      await loadNotifications();

      if (notif.relatedEntityId) {
        router.push(`/shipments/${notif.relatedEntityId}`);
      }
    } catch (error) {
      console.error("Error al abrir detalle del envío", error);
    }
  };

  
  // ===============================
  // CONTADORES
  // ===============================
  const newOrdersCount = notifications.filter((n) =>
    isNewOrder(n.type)
  ).length;

  const urgentCount = notifications.filter((n) =>
    isUrgentOrder(n.type)
  ).length;

  const messageCount = notifications.filter((n) =>
    isMessage(n.type)
  ).length;

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Bienvenido Pepe</h1>

      {!loading && notifications.length === 0 && (
        <p className={styles.empty}>No tienes notificaciones aún</p>
      )}

      <section className={styles.content}>
        {/* NOTIFICACIONES */}
        <div className={styles.notifications}>
          {notifications.map((notif) => {
            const Icon = getIconByType(notif.type);

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

                {(isNewOrder(notif.type) || isUrgentOrder(notif.type)) && (
                  <button
                    className={styles.primaryBtn}
                    onClick={() => handleViewDetails(notif)}
                  >
                    Ver detalles
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* RESUMEN */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={`${styles.icon} ${styles.iconBlue}`}>
              <HiOutlineTruck size={18} />
            </span>
            <div>
              <small>Pedidos Nuevos</small>
              <strong>{newOrdersCount}</strong>
            </div>
          </div>

          <div className={styles.statCard}>
            <span className={`${styles.icon} ${styles.iconRed}`}>
              <HiOutlineExclamation size={18} />
            </span>
            <div>
              <small>Urgentes</small>
              <strong>{urgentCount}</strong>
            </div>
          </div>

          <div className={styles.statCard}>
            <span className={`${styles.icon} ${styles.iconPurple}`}>
              <HiOutlineChatAlt2 size={18} />
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
