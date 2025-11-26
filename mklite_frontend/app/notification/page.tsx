"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

import { notificationIcons } from "../utils/notificationIcons";
import Notification from "../models/notification.model";
import { instance } from "../utils/axios";

export default function Notificaciones() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const { data } = await instance.get(
        "/notifications/all-by-role?role=Client"
      );

      const allowed = [
        "ORDER_RECEIVED",
        "ORDER_SHIPPED",
        "ORDER_DELIVERED",
        "NEW_PROMOTION",
      ];

      setNotifications(data.filter((n: Notification) => allowed.includes(n.type)));
    } catch (error) {
      console.error("Error cargando notificaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleDelete = async (id: number) => {
    await instance.delete(`/notifications/${id}`);
    loadNotifications();
  };

  const handleMarkAsRead = async (id: number) => {
    await instance.patch(`/notifications/${id}/read`);
    loadNotifications();
  };

  if (loading) return <div className={styles.loading}>Cargando...</div>;

  return (
    <div className={styles.pageBackground}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Notificaciones</h1>

        <div className={styles.container}>
          {notifications.length === 0 ? (
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
  );
}
