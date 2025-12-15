"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

import Order from "../models/order.model";
import { mockOrders } from "./mockOrders";

import OrdersTable from "./components/OrdersTable";
import OrderDetailCard from "./components/OrderDetailCard";
import { useRouter } from "next/navigation";


export default function RiderHomePage() {
  const riderName = "Jp";

  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();


  useEffect(() => {
    // UI demo con datos mock (sin backend)
    setOrders(mockOrders);
    setLoading(false);
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Bienvenido {riderName}</h1>

      <section className={styles.content}>
        {/* CARD IZQUIERDA - TABLA */}
        <div className={styles.card}>
          <header className={styles.cardHeader}>
            <span className={styles.cardTitle}>Pedidos disponibles</span>
          </header>

          <div className={styles.cardBody}>
            {loading ? (
              <p>Cargando pedidos...</p>
            ) : orders.length === 0 ? (
              <p className={styles.emptyText}>
                No hay pedidos disponibles por ahora.
              </p>
            ) : (
              <OrdersTable
                orders={orders}
                onSelect={(order) => setSelectedOrder(order)}
              />
            )}
          </div>
        </div>

        {/* CARD DERECHA - DETALLE */}
        <OrderDetailCard
          order={selectedOrder}
          onAccept={() => {
            if (!selectedOrder) return;
            router.push(`/rider/delivery/${selectedOrder.id}`);
          }}
          onContact={() => {
            // opcional: luego lo conectamos a tel:
            alert("Contactar cliente (demo)");
          }}
        />

      </section>
    </div>
  );
}
