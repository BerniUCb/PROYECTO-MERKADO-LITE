"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode"; 
import styles from "./page.module.css";
import {
  HiOutlineBell,
  HiOutlineTruck,
  HiOutlineExclamation,
  HiOutlineChatAlt2,
} from "react-icons/hi";
import type { IconType } from "react-icons";

import {NotificationService }from "@/app/services/notification.service";
import type Notification from "@/app/models/notification.model";

export default function NotificationDrivePage() {
  const router = useRouter();

  // Estado para el ID del conductor
  const [driverId, setDriverId] = useState<number | null>(null);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // 1. OBTENER ID DEL TOKEN AL MONTAR
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const id = decoded.sub || decoded.id; // Ajusta según tu payload JWT
        setDriverId(Number(id));
      } catch (e) {
        console.error("Error decodificando token", e);
        // Opcional: Redirigir al login
      }
    } else {
        setLoading(false); // No hay token, terminamos carga
    }
  }, []);

  // 2. CARGAR NOTIFICACIONES CUANDO TENGAMOS EL ID
  useEffect(() => {
    if (driverId) {
        loadNotifications(driverId);
    }
  }, [driverId]);

  const loadNotifications = async (id: number) => {
    try {
      setLoading(true);

      // Pasamos el ID explícitamente al servicio
      const all = await NotificationService.getDriverNotifications(id);
      
      // Filtramos las no leídas localmente para ahorrar una petición extra si el backend no tiene endpoint específico
      // O usamos el método del servicio pasando el ID también
      const unread = await NotificationService.getUnreadDriverNotifications(id);

      setNotifications(all);
      setUnreadCount(unread.length);
    } catch (error) {
      console.error("Error al cargar notificaciones del repartidor", error);
    } finally {
      setLoading(false);
    }
  };

  // ... (Resto de funciones: isNewOrder, getIconByType, etc. igual que antes) ...
  const isNewOrder = (type: string) => type === "ORDER_RECEIVED";
  const isUrgentOrder = (type: string) => type === "ORDER_SHIPPED";
  const isMessage = (type: string) => type === "NEW_PROMOTION";

  const getIconByType = (type: string): IconType => {
    if (isNewOrder(type)) return HiOutlineTruck;
    if (isUrgentOrder(type)) return HiOutlineExclamation;
    if (isMessage(type)) return HiOutlineChatAlt2;
    return HiOutlineBell;
  };

  const handleViewDetails = async (notif: Notification) => {
    try {
      if (!notif.isRead) {
        await NotificationService.markAsRead(notif.id);
      }
      if (driverId) await loadNotifications(driverId);

      if (notif.relatedEntityId) {
        router.push(`/shipments/${notif.relatedEntityId}`);
      }
    } catch (error) {
      console.error("Error al abrir detalle", error);
    }
  };

  const newOrdersCount = notifications.filter((n) => isNewOrder(n.type)).length;
  const urgentCount = notifications.filter((n) => isUrgentOrder(n.type)).length;
  const messageCount = notifications.filter((n) => isMessage(n.type)).length;

  if (loading) return <div style={{padding: 20}}>Cargando notificaciones...</div>;

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Notificaciones</h1>

      {notifications.length === 0 && (
        <p className={styles.empty}>No tienes notificaciones aún</p>
      )}

      <section className={styles.content}>
        <div className={styles.notifications}>
          {notifications.map((notif) => {
            const Icon = getIconByType(notif.type);
            return (
              <div
                key={notif.id}
                className={`${styles.notificationCard} ${!notif.isRead ? styles.urgent : ""}`}
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
                    {!notif.isRead && <span className={styles.badge}>Nuevo</span>}
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

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={`${styles.icon} ${styles.iconBlue}`}><HiOutlineTruck size={18} /></span>
            <div><small>Pedidos Nuevos</small><strong>{newOrdersCount}</strong></div>
          </div>
          <div className={styles.statCard}>
            <span className={`${styles.icon} ${styles.iconRed}`}><HiOutlineExclamation size={18} /></span>
            <div><small>Urgentes</small><strong>{urgentCount}</strong></div>
          </div>
          <div className={styles.statCard}>
            <span className={`${styles.icon} ${styles.iconPurple}`}><HiOutlineChatAlt2 size={18} /></span>
            <div><small>Mensajes</small><strong>{messageCount}</strong></div>
          </div>
        </div>
      </section>
    </main>
  );
}