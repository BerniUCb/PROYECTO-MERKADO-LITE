"use client";

import styles from "./modal.module.css";
import type Order from "@/app/models/order.model";

interface Props {
  order: Order;
  onClose: () => void;
}

export default function OrderDetailModal({ order, onClose }: Props) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Detalle del Pedido #{order.id}</h2>

        <div className={styles.row}>
          <strong>Estado:</strong>
          <span>{order.status}</span>
        </div>

        <div className={styles.row}>
          <strong>Fecha:</strong>
          <span>{new Date(order.createdAt).toLocaleString()}</span>
        </div>

        <div className={styles.row}>
          <strong>Total:</strong>
          <span>{Number(order.orderTotal).toFixed(2)} Bs</span>
        </div>

        <h3 className={styles.subtitle}>Productos</h3>

        <ul className={styles.list}>
          {order.items?.map((item) => (
           <li key={item.id}>
              {item.product?.name}: {item.quantity} x {Number(item.unitPrice).toFixed(2)} Bs ={" "}
              {Number(item.quantity * item.unitPrice).toFixed(2)} Bs
          </li>

          ))}
        </ul>

        <button className={styles.closeBtn} onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}
