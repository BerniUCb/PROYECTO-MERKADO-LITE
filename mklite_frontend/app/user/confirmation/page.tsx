"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./page.module.css";
import { OrderService } from "@/app/services/order.service";
import type Order from "@/app/models/order.model";

export default function PedidoConfirmado() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // ============================
  // CARGAR PEDIDO REAL
  // ============================
  useEffect(() => {
    if (!orderId) return;

    async function loadOrder() {
      try {
        const data = await OrderService.getById(Number(orderId));
        setOrder(data);
      } catch (error) {
        console.error("Error cargando pedido", error);
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [orderId]);

  if (loading) return <p>Cargando pedido...</p>;
  if (!order) return <p>No se pudo cargar el pedido.</p>;

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.check}>✓</div>
        <h2>¡Pedido Confirmado!</h2>
        <p>Tu pedido ha sido procesado exitosamente</p>
        <span>Recibirás un correo de confirmación con los detalles</span>
      </div>

      <div className={styles.content}>
        {/* ================= LEFT ================= */}
        <div className={styles.left}>
          {/* INFO PEDIDO */}
          <div className={styles.card}>
            <h3>Información del Pedido</h3>

            <div className={styles.infoGrid}>
              <div>
                <span>Número de Pedido</span>
                <p>MKL-{order.id}</p>
              </div>
              <div>
                <span>Fecha del Pedido</span>
                <p>{new Date(order.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* PRODUCTOS */}
          <div className={styles.card}>
            <h3>Productos</h3>

            {order.items.map((item) => (
              <div key={item.id} className={styles.product}>
                <div className={styles.productInfo}>
                  <img
                    src={item.product.imageUrl || "/img/default.png"}
                    alt={item.product.name}
                  />
                  <div>
                    <p>{item.product.name}</p>
                    <span>Cantidad: {item.quantity}</span>
                  </div>
                </div>

                <strong>
                  Bs. {(Number(item.unitPrice) * item.quantity).toFixed(2)}
                </strong>
              </div>
            ))}
          </div>

          {/* ENTREGA */}
          <div className={styles.card}>
            <h3>Información de Entrega</h3>

            {order.user?.addresses?.[0] && (
              <div className={styles.delivery}>
                <span>Dirección de Entrega</span>
                <p>{order.user.addresses[0].street}</p>
                <small>
                  {order.user.addresses[0].city},{" "}
                  {order.user.addresses[0].state}
                </small>
              </div>
            )}

            <div className={styles.deliveryTime}>
              Tiempo estimado de entrega: 2-3 días hábiles
            </div>
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className={styles.right}>
          <div className={styles.card}>
            <h3>Resumen de compra</h3>

            <div className={styles.row}>
              <span>Total</span>
              <strong>Bs. {Number(order.orderTotal).toFixed(2)}</strong>
            </div>

            <button
              className={styles.primaryBtn}
              onClick={() => router.push("/user/orders")}
            >
              Seguir mi Pedido
            </button>

            <button
              className={styles.secondaryBtn}
              onClick={() => router.push("/")}
            >
              Continuar Comprando
            </button>

            <small>¿Necesitas ayuda? Contáctanos</small>
          </div>
        </div>
      </div>
    </div>
  );
}
