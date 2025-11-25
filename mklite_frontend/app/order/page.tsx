"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { OrderService } from "@/app/services/order.service";
import type Order from "@/app/models/order.model";
import OrderDetailModal from "./orderDetailModal";

export default function OrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "delivered" | "pending" | "cancelled">("all");

  // estado del modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await OrderService.getAll(1, 50, "createdAt", "desc");
        setOrders(data);
      } catch (err) {
        console.error("Error al cargar pedidos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    return order.status === filter;
  });

  return (
    <>
      <Header />

      <div className={styles.wrapper}>
        {/* Encabezado */}
        <div className={styles.headerRow}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${filter === "all" ? styles.active : ""}`}
              onClick={() => setFilter("all")}
            >
              Todos ({orders.length})
            </button>

            <button
              className={`${styles.tab} ${filter === "delivered" ? styles.active : ""}`}
              onClick={() => setFilter("delivered")}
            >
              Completados
            </button>

            <button
              className={`${styles.tab} ${filter === "pending" ? styles.active : ""}`}
              onClick={() => setFilter("pending")}
            >
              Pendientes
            </button>

            <button
              className={`${styles.tab} ${filter === "cancelled" ? styles.active : ""}`}
              onClick={() => setFilter("cancelled")}
            >
              Cancelados
            </button>
          </div>

          <div className={styles.searchBox}>
            <input placeholder="Buscar Pedido" />
            <span className={styles.searchIcon}>🔍</span>
          </div>
        </div>

        {/* Tabla */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Código Pedido</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Detalle</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5}>Cargando pedidos...</td>
                </tr>
              )}

              {!loading && filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={5}>No hay pedidos para este filtro.</td>
                </tr>
              )}

              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>#ORD{order.id.toString().padStart(4, "0")}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{order.orderTotal ? Number(order.orderTotal).toFixed(2) : "0.00"} Bs</td>

                  <td>
                    <span className={`${styles.status} ${styles[order.status]}`}>
                      {order.status}
                    </span>
                  </td>

                  <td
                    className={styles.detailButton}
                    onClick={() => setSelectedOrder(order)}
                  >
                    Ver detalle
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      <Footer />
    </>
  );
}
