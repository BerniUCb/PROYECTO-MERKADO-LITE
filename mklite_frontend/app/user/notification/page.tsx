"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

import { notificationIcons } from "../../utils/notificationIcons";
import Notification from "@/app/models/notification.model";
import { instance } from "../../utils/axios";
import UserSidebar from "../../components/UserSidebar";

export default function Notificaciones() {
  const [userId, setUserId] = useState<number | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // ============================================================
  // 1) OBTENER USER DESDE LOCALSTORAGE
  // ============================================================
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return;

    const parsed = JSON.parse(stored);
    setUserId(parsed.id);
  }, []);

  // ============================================================
  // 2) CARGAR NOTIFICACIONES POR USERID
  // ============================================================
  useEffect(() => {
    if (!userId) return;

    const loadNotifications = async () => {
      try {
        const { data } = await instance.get(`/notifications/user/${userId}`);

        // Filtro solo tipos permitidos
        const allowed = [
          "ORDER_RECEIVED",
          "ORDER_SHIPPED",
          "ORDER_DELIVERED",
          "NEW_PROMOTION",
        ];

        setNotifications(data.filter((n: Notification) => allowed.includes(n.type)));
      } catch (error) {
        console.error("❌ Error cargando notificaciones:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [userId]);

  // ============================================================
  // BORRAR
  // ============================================================
  const handleDelete = async (id: number) => {
    await instance.delete(`/notifications/${id}`);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // ============================================================
  // MARCAR COMO LEÍDA
  // ============================================================
  const handleMarkAsRead = async (id: number) => {
    await instance.patch(`/notifications/${id}/read`);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  // ============================================================
  // LOADING
  // ============================================================
  if (userId === null) return <div className={styles.loading}>Cargando...</div>;

  return (
  <div style={{ display: "flex", width: "100%" }}>

   

    {/* === CONTENIDO PRINCIPAL === */}
    <div className={styles.pageBackground}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Notificaciones</h1>

        <div className={styles.container}>
          {loading ? (
            <p className={styles.loading}>Cargando...</p>
          ) : notifications.length === 0 ? (
            <p className={styles.empty}>No tienes notificaciones.</p>
          ) : (
            notifications.map((n) => {
              const Icon = notificationIcons[n.type];

              return (
                <div
                  key={n.id}
                  className={`${styles.item} ${!n.isRead ? styles.unread : ""}`}
                  onClick={() => handleMarkAsRead(n.id)}
                >
                  <div className={styles.left}>
                    <div className={styles.iconCircle}>
                      <Icon className={styles.icon} />
                    </div>

                    <div className={styles.textBlock}>
                      <div className={styles.mainText}>{n.title}</div>
                      <div className={styles.subText}>{n.detail}</div>
                    </div>
                  </div>

                  <div className={styles.right}>
                    <div className={styles.date}>
                      {new Date(n.createdAt).toLocaleDateString()} —{" "}
                      {new Date(n.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>

                    <button
                      className={styles.deleteBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(n.id);
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>

  </div>
);

}
