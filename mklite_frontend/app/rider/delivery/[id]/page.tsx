"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./page.module.css";

import { mockOrders } from "../../mockOrders";
import Order from "../../../models/order.model";

type RiderStatus = "Disponible" | "Aceptado" | "Retirado"; // (Entregado luego si quieres)

export default function RiderDeliveryPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const orderId = Number(params.id);

  const order: Order | undefined = useMemo(() => {
    return mockOrders.find((o) => o.id === orderId);
  }, [orderId]);

  // Estado local (solo UI demo)
  const [status, setStatus] = useState<RiderStatus>(
    (order?.status as RiderStatus) ?? "Disponible"
  );

  if (!order) {
    return (
      <div className={styles.notFound}>
       
        <p>Pedido no encontrado</p>
      </div>
    );
  }

  const customerName = order.user?.fullName ?? "Cliente";
  const customerPhone = order.user?.phone ?? "(+591) 00000000";

  const storeName = "MERKADO LITE";
  const storeAddress1 = "Julio Mendez, Cercado";
  const storeAddress2 = "Cochabamba, Bolivia";

  const customerAddress1 = "Av. América #456";
  const customerAddress2 = "Cercado, Cochabamba, Bolivia";

  const headerLabel =
    status === "Disponible"
      ? "Disponible"
      : status === "Aceptado"
      ? "Aceptado (pendiente de retiro)"
      : "Retirado (en camino)";

  return (
    <div className={styles.wrapper}>
      {/* TOP */}
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => router.push("/rider")}>
          ← Volver
        </button>

        <div className={styles.topStatus}>
          <span className={styles.dot} />
          <span className={styles.topStatusText}>{headerLabel}</span>
        </div>

        {status === "Disponible" && (
          <button className={styles.primaryGreen} onClick={() => setStatus("Aceptado")}>
            Aceptar pedido
          </button>
        )}
      </div>

      <div className={styles.layout}>
        {/* LEFT */}
        <aside className={styles.leftCol}>
          {/* RECOGER EN */}
          <div className={styles.card}>
            <div className={`${styles.cardHead} ${styles.headRed}`}>Recoger en</div>

            <div className={styles.cardBody}>
              <h3 className={styles.bigTitle}>{storeName}</h3>

              <p className={styles.line}>📍 {storeAddress1}</p>
              <p className={styles.subLine}>{storeAddress2}</p>

              <p className={styles.line}>📞 {customerPhone}</p>

              <button
                className={styles.primaryRed}
                onClick={() => setStatus("Retirado")}
                disabled={status !== "Aceptado"}
                title={status !== "Aceptado" ? "Primero acepta el pedido" : "Confirmar retiro"}
              >
                Confirmar retiro
              </button>
            </div>
          </div>

          {/* ENTREGAR A */}
          <div className={styles.card}>
            <div className={`${styles.cardHead} ${styles.headGreen}`}>Entregar a</div>

            <div className={styles.cardBody}>
              <h3 className={styles.bigTitle}>{customerName}</h3>

              <p className={styles.line}>📍 {customerAddress1}</p>
              <p className={styles.subLine}>{customerAddress2}</p>

              <p className={styles.line}>📞 {customerPhone}</p>

              <a className={styles.outlineGreen} href={`tel:${customerPhone}`}>
                Llamar
              </a>
            </div>
          </div>

          {/* DETALLES */}
          <div className={styles.card}>
            <div className={styles.detailsHead}>Detalles del Pedido</div>

            <div className={styles.cardBody}>
              <p className={styles.kv}>
                <span>Número:</span>
                <strong>MKL-{order.id}</strong>
              </p>

              <p className={styles.kv}>
                <span>Fecha:</span>
                <strong>{new Date(order.createdAt).toLocaleString()}</strong>
              </p>

              <p className={styles.kv}>
                <span>Total:</span>
                <strong>Bs. {order.orderTotal.toFixed(2)}</strong>
              </p>

              <div className={styles.productsTitle}>
                Productos ({order.items?.length ?? 0})
              </div>

              {(order.items ?? []).map((item: any) => (
                <div key={item.id} className={styles.productRow}>
                  <div className={styles.productImg} />
                  <div>
                    <div className={styles.productName}>{item.name}</div>
                    <div className={styles.productQty}>Cantidad: {item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* RIGHT (MAPA) */}
        <section className={styles.rightCol}>
          <div className={styles.mapPlaceholder}>Aquí va el mapa (siguiente paso)</div>
        </section>
      </div>
    </div>
  );
}
