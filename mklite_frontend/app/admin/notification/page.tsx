"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

// IMPORTS CORRECTOS SEGÚN LA NUEVA ESTRUCTURA
import notificationService from "@/app/services/notification.service";
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

  // Cargar datos desde backend PERO PARA ADMIN
  useEffect(() => {
    notificationService
      .getAdminNotifications()
      .then((res) => setNotifications(res))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando...</p>;

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
          {filtered.map((n) => {
            const tag = tagMap[n.type];

            return (
              <div key={n.id} className={styles.card}>
                <img
                  src={iconMap[n.category] || "/icons/bell.svg"}
                  className={styles.icon}
                />

                <div className={styles.info}>
                  <div className={styles.row}>
                    <h3>{n.title}</h3>

                    {/* ELIMINAR */}
                    <span
                      className={styles.close}
                      onClick={() =>
                        notificationService.delete(n.id).then(() =>
                          setNotifications((old) =>
                            old.filter((item) => item.id !== n.id)
                          )
                        )
                      }
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
                  </div>

                  {/* FECHA */}
                  <div className={styles.meta}>
                    {new Date(n.createdAt).toLocaleString("es-BO")} ·{" "}
                    {n.category}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
