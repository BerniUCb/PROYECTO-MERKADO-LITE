"use client";

import styles from "./OrdersTable.module.css";
import Order from "../../models/order.model";

interface Props {
  orders: Order[];
  onSelect: (order: Order) => void;
}

export default function OrdersTable({ orders, onSelect }: Props) {
  return (
    <div className={styles.table}>
      <div className={styles.header}>
        <span>Estado</span>
        <span>Fecha</span>
        <span>Tarifa</span>
        <span>Desde</span>
        <span>Hasta</span>
        <span>Detalle</span>
      </div>

      {orders.map((order) => (
        <div
          key={order.id}
          className={styles.row}
          onClick={() => onSelect(order)}
        >
          <span className={styles.status}>{order.status}</span>

          <span>
            {new Date(order.createdAt).toLocaleDateString()}
          </span>

          <span className={styles.price}>
            Bs. {order.orderTotal.toFixed(2)}
            <small>Pago repartidor</small>
          </span>

          <span className={styles.location}>
            <strong>Tienda Merkado Lite</strong>
            <small>Dirección de tienda</small>
          </span>

          <span className={styles.location}>
            <strong>{order.user.fullName}</strong>
            <small>Dirección cliente</small>
          </span>

          <span className={styles.dots}>•••</span>
        </div>
      ))}
    </div>
  );
}
