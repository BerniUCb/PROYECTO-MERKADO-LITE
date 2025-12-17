"use client";

import styles from "./OrderDetailCard.module.css";
import type { RiderOrder } from "../mockOrders";

type Props = {
  order: RiderOrder | null;
  onAccept?: () => void;
  onContact?: () => void;
};

export default function OrderDetailCard({
  order,
  onAccept,
  onContact,
}: Props) {
  if (!order) {
    return (
      <aside className={styles.card}>
        <p className={styles.empty}>
          Selecciona un pedido para ver el detalle
        </p>
      </aside>
    );
  }

  const date = new Date(order.createdAt).toLocaleDateString();
  const customerName = order.user.fullName;
  const email = order.user.email;
  const phone = order.user.phone;

  const pickupName = order.store.name;
  const pickupAddress = order.store.location.address1;

  const deliveryName = customerName;
  const deliveryAddress = order.customerLocation.address1;

  // Demo (luego backend)
  const riderPay = 8.0;

  return (
    <aside className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.avatar}>👤</div>

        <div className={styles.headerInfo}>
          <div className={styles.customerName}>{customerName}</div>
          <div className={styles.orderId}>
            Pedido: #{String(order.id).padStart(4, "0")}
          </div>

          {email && <div className={styles.email}>{email}</div>}
          {phone && <div className={styles.phone}>{phone}</div>}
        </div>
      </div>

      <div className={styles.content}>
        {/* Información del pedido */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            Información del pedido
          </div>

          <div className={styles.block}>
            <div className={styles.blockLabel}>Fecha:</div>
            <div className={styles.blockValue}>{date}</div>
          </div>

          <div className={styles.block}>
            <div className={styles.blockLabel}>Estado:</div>
            <div className={styles.blockValue}>{order.status}</div>
          </div>
        </div>

        {/* Ruta de entrega */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Ruta de entrega</div>

          <div className={styles.routeCard}>
            <div className={styles.routeLabel}>Recojo:</div>
            <div className={styles.routeName}>{pickupName}</div>
            <div className={styles.routeAddress}>{pickupAddress}</div>
          </div>

          <div className={styles.routeCard}>
            <div className={styles.routeLabel}>Entrega:</div>
            <div className={styles.routeName}>{deliveryName}</div>
            <div className={styles.routeAddress}>
              {deliveryAddress}
            </div>
          </div>
        </div>

        {/* Productos */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Productos</div>

          <ul className={styles.products}>
            {order.items.map((it) => (
              <li key={it.id} className={styles.productRow}>
                <span className={styles.productQty}>
                  {it.quantity}x
                </span>
                <span className={styles.productName}>
                  {it.name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pago */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            Pago al repartidor
          </div>

          <div className={styles.payBox}>
            <span className={styles.payAmount}>
              Bs. {riderPay.toFixed(2)}
            </span>
          </div>
        </div>

        {onAccept && (
          <button
            type="button"
            className={styles.acceptBtn}
            onClick={onAccept}
          >
            Aceptar pedido
          </button>
        )}

        {onContact && (
          <button
            type="button"
            className={styles.contactBtn}
            onClick={onContact}
          >
            Contactar cliente
          </button>
        )}
      </div>
    </aside>
  );
}
