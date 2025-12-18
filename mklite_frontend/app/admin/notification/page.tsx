"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { NotificationService } from "@/app/services/notification.service";
import Notification from "@/app/models/notification.model";

// ------------------ MAPEO DE CATEGORÍAS ------------------
const categoryMap: Record<string, string> = {
  CASH_REGISTER_CLOSED: "inventario",
  LOW_STOCK: "inventario",
  HIGH_DEMAND_PRODUCT: "inventario",

  ORDER_RECEIVED: "pedidos",
  ORDER_SHIPPED: "pedidos",
  ORDER_DELIVERED: "pedidos",

  NEW_PROMOTION: "promos",
};

// ------------------ MAPEO DE TAGS ------------------
const tagMap: Record<string, { label: string; color: string }> = {
  LOW_STOCK: { label: "Advertencia", color: "#FFE7A6" },
  HIGH_DEMAND_PRODUCT: { label: "Alta demanda", color: "#E7D3FF" },
  CASH_REGISTER_CLOSED: { label: "Crítico", color: "#FFB8B8" },
  ORDER_RECEIVED: { label: "Pedido recibido", color: "#D9F8C4" },
  ORDER_SHIPPED: { label: "En camino", color: "#CBE7FF" },
  ORDER_DELIVERED: { label: "Entregado", color: "#E6FFD9" },
  NEW_PROMOTION: { label: "Promos", color: "#FFD7AD" },
};

// ------------------ Íconos según categoría ------------------
const iconMap: Record<string, string> = {
  inventario: "/icons/box.svg",
  pedidos: "/icons/order.svg",
  promos: "/icons/tag.svg",
};

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState("todas");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos desde backend PARA ADMIN
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await NotificationService.getAdminNotifications();
        setNotifications(data);
      } catch (err: any) {
        console.error("Error cargando notificaciones:", err);
        setError(err.response?.data?.message || err.message || "Error al cargar notificaciones");
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  // Función para eliminar notificación
  const handleDelete = async (id: number) => {
    try {
      await NotificationService.delete(id);
      setNotifications((old) => old.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error eliminando notificación:", error);
      alert("Error al eliminar la notificación");
    }
  };

  // Función para marcar como leída
  const handleMarkAsRead = async (id: number) => {
    try {
      await NotificationService.markAsRead(id);
      setNotifications((old) =>
        old.map((item) =>
          item.id === id ? { ...item, isRead: true } : item
        )
      );
    } catch (error) {
      console.error("Error marcando como leída:", error);
    }
  };

  // Procesar categoría basada en el tipo
  const processed = notifications.map((n) => ({
    ...n,
    category: categoryMap[n.type] || "otros",
  }));

  // Aplicar filtro
  const filtered =
    activeFilter === "todas"
      ? processed
      : processed.filter((n) => n.category === activeFilter);

  if (loading) {
    return (
      <div className={styles.overlay}>
        <div className={styles.panel}>
          <p style={{ textAlign: 'center', padding: '40px', color: '#777' }}>
            Cargando notificaciones...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.overlay}>
        <div className={styles.panel}>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#e94b4b', marginBottom: '20px' }}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 20px',
                backgroundColor: '#e94b4b',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        {/* ENCABEZADO */}
        <div className={styles.panelHeader}>
          <div>
            <h1 className={styles.title}>Notificaciones del Administrador</h1>
            <p className={styles.subtitle}>Últimas alertas del sistema</p>
          </div>

          <span className={styles.closeBtn} onClick={() => window.history.back()}>
            ×
          </span>
        </div>

        {/* FILTROS */}
        <div className={styles.filters}>
          {["todas", "inventario", "pedidos", "promos"].map((f) => (
            <button
              key={f}
              className={`${styles.filterBtn} ${
                activeFilter === f ? styles.active : ""
              }`}
              onClick={() => setActiveFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* LISTA DE NOTIFICACIONES */}
        <div className={styles.list}>
          {filtered.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '40px', color: '#777' }}>
              No hay notificaciones para mostrar
            </p>
          ) : (
            filtered.map((n) => {
              const tag = tagMap[n.type];

              return (
                <div 
                  key={n.id} 
                  className={styles.card}
                  style={{
                    opacity: n.isRead ? 0.7 : 1,
                    borderLeft: n.isRead ? '3px solid #ccc' : '3px solid #e94b4b',
                  }}
                >
                  <img
                    src={iconMap[n.category] || "/icons/bell.svg"}
                    className={styles.icon}
                    alt={n.category}
                  />

                  <div className={styles.info}>
                    <div className={styles.row}>
                      <h3 style={{ 
                        fontWeight: n.isRead ? 'normal' : 'bold',
                        color: n.isRead ? '#777' : '#1a1a1a',
                      }}>
                        {n.title}
                      </h3>

                      {/* ELIMINAR */}
                      <span
                        className={styles.close}
                        onClick={() => handleDelete(n.id)}
                        title="Eliminar notificación"
                      >
                        ×
                      </span>
                    </div>

                    <p className={styles.detail}>{n.detail}</p>

                    {/* TAGS */}
                    <div className={styles.tags}>
                      <span className={styles.tag1}>
                        {n.category.charAt(0).toUpperCase() + n.category.slice(1)}
                      </span>

                      <span
                        className={styles.tag2}
                        style={{ background: tag?.color }}
                      >
                        {tag?.label}
                      </span>

                      {!n.isRead && (
                        <span
                          className={styles.tag2}
                          style={{ 
                            background: '#e94b4b', 
                            color: 'white',
                            cursor: 'pointer',
                          }}
                          onClick={() => handleMarkAsRead(n.id)}
                          title="Marcar como leída"
                        >
                          Marcar como leída
                        </span>
                      )}
                    </div>

                    {/* FECHA */}
                    <div className={styles.meta}>
                      {new Date(n.createdAt).toLocaleString("es-BO")} ·{" "}
                      {n.category}
                    </div>
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