"use client";

import { useCallback, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./page.module.css";

import { mockOrders, type RiderOrder } from "../../mockOrders";
import RouteMap, { type RouteStep } from "../../components/RouteMap";


type RiderStage = "PENDING_PICKUP" | "ON_THE_WAY";


type CompletedOrder = {
  id: number;
  customerName: string;
  storeName: string;
  deliveredAt: string;
  total: number;
  riderEarning: number;
};

function saveCompletedOrder(order: CompletedOrder) {
  const STORAGE_KEY = "rider_completed_orders";

  const prev: CompletedOrder[] = JSON.parse(
    localStorage.getItem(STORAGE_KEY) ?? "[]"
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify([order, ...prev]));
}





export default function RiderDeliveryPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const orderId = Number(params.id);

  // ===============================
  // Order
  // ===============================
  const order: RiderOrder | undefined = useMemo(() => {
    return mockOrders.find((o) => o.id === orderId);
  }, [orderId]);

  // ===============================
  // State
  // ===============================
  const [stage, setStage] = useState<RiderStage>("PENDING_PICKUP");
  const [showDoneModal, setShowDoneModal] = useState(false);

  const [routeSteps, setRouteSteps] = useState<RouteStep[]>([]);
  const [distanceKm, setDistanceKm] = useState(0);
  const [durationMin, setDurationMin] = useState(0);

  // ===============================
  // Handlers
  // ===============================
  const handleRoute = useCallback(
    (data: { steps: RouteStep[]; distanceKm: number; durationMin: number }) => {
      setRouteSteps(data.steps);
      setDistanceKm(data.distanceKm);
      setDurationMin(data.durationMin);
    },
    []
  );

  if (!order) {
    return (
      <div className={styles.notFound}>
        <p>Pedido no encontrado</p>
      </div>
    );
  }

  // ===============================
  // Derived data
  // ===============================
  const customerName = order.user?.fullName ?? "Cliente";
  const customerPhone = order.user?.phone ?? "(+591) 00000000";

  const storeName = order.store?.name ?? "MERKADO LITE";
  const storeAddress1 =
    order.store?.location?.address1 ?? "Dirección tienda";
  const storeAddress2 =
    order.store?.location?.address2 ?? "Cochabamba, Bolivia";

  const customerAddress1 =
    order.customerLocation?.address1 ?? "Dirección cliente";
  const customerAddress2 =
    order.customerLocation?.address2 ?? "Cochabamba, Bolivia";

  const headerLabel =
    stage === "PENDING_PICKUP"
      ? "Pendiente de retiro"
      : "Retirado (en camino)";

  const storePoint = {
    lat: order.store.location.lat,
    lng: order.store.location.lng,
  };

  const customerPoint = {
    lat: order.customerLocation.lat,
    lng: order.customerLocation.lng,
  };

  // ===============================
  // Business actions
  // ===============================
  const handleConfirmPickup = () => {
    setStage("ON_THE_WAY");
  };

  // demo – luego backend
  const riderEarning = 25.0;

  const handleConfirmDelivery = () => {
    saveCompletedOrder({
      id: order.id,
      customerName,
      storeName,
      deliveredAt: new Date().toISOString(),
      total: order.orderTotal,
      riderEarning,
    });

    setShowDoneModal(true);
  };

  const handleNextOrder = () => {
    setShowDoneModal(false);
    router.push("/rider");
  };

  const handleFinishShift = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("rider_active_order");

    router.push("/");
  };

  // ===============================
  // Render
  // ===============================
  return (
    <div className={styles.wrapper}>
      {/* TOP BAR */}
      <div className={styles.topBar}>
        <button
          className={styles.backBtn}
          onClick={() => router.push("/rider")}
        >
          ← Volver
        </button>

        <div className={styles.topStatus}>
          <span className={styles.dot} />
          <span className={styles.topStatusText}>{headerLabel}</span>
        </div>
      </div>

      <div className={styles.layout}>
        {/* LEFT COLUMN */}
        <aside className={styles.leftCol}>
          {/* PICKUP */}
          <div className={styles.card}>
            <div
              className={`${styles.cardHead} ${
                stage === "PENDING_PICKUP"
                  ? styles.headRed
                  : styles.headPicked
              }`}
            >
              Recoger en
            </div>

            <div className={styles.cardBody}>
              <h3 className={styles.bigTitle}>{storeName}</h3>

              <p className={styles.line}>📍 {storeAddress1}</p>
              <p className={styles.subLine}>{storeAddress2}</p>

              <p className={styles.line}>📞 {customerPhone}</p>

              {stage === "PENDING_PICKUP" ? (
                <button
                  className={styles.primaryRed}
                  onClick={handleConfirmPickup}
                >
                  Confirmar retiro
                </button>
              ) : (
                <button className={styles.primaryPicked} disabled>
                  ✓ Recogido
                </button>
              )}
            </div>
          </div>

          {/* DELIVERY */}
          <div className={styles.card}>
            <div className={`${styles.cardHead} ${styles.headGreen}`}>
              Entregar a
            </div>

            <div className={styles.cardBody}>
              <h3 className={styles.bigTitle}>{customerName}</h3>

              <p className={styles.line}>📍 {customerAddress1}</p>
              <p className={styles.subLine}>{customerAddress2}</p>

              <p className={styles.line}>📞 {customerPhone}</p>

              <a
                className={styles.outlineGreen}
                href={`tel:${customerPhone}`}
              >
                Llamar
              </a>

              {stage === "ON_THE_WAY" && (
                <button
                  className={styles.primaryGreen}
                  onClick={handleConfirmDelivery}
                  style={{ marginTop: 10 }}
                >
                  Confirmar entrega
                </button>
              )}
            </div>
          </div>

          {/* ORDER DETAILS */}
          <div className={styles.card}>
            <div className={styles.detailsHead}>Detalles del Pedido</div>

            <div className={styles.cardBody}>
              <p className={styles.kv}>
                <span>Número:</span>
                <strong>MKL-{order.id}</strong>
              </p>

              <p className={styles.kv}>
                <span>Fecha:</span>
                <strong>
                  {new Date(order.createdAt).toLocaleString()}
                </strong>
              </p>

              <p className={styles.kv}>
                <span>Total:</span>
                <strong>
                  Bs. {order.orderTotal.toFixed(2)}
                </strong>
              </p>

              <div className={styles.productsTitle}>
                Productos ({order.items?.length ?? 0})
              </div>

              {(order.items ?? []).map((item: any) => (
                <div key={item.id} className={styles.productRow}>
                  <div className={styles.productImg} />
                  <div>
                    <div className={styles.productName}>{item.name}</div>
                    <div className={styles.productQty}>
                      Cantidad: {item.quantity}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN */}
        <section className={styles.rightCol}>
          {/* MAP */}
          <div className={styles.mapCard}>
            <div className={styles.mapHeader}>
              <span>Mapa de Ruta</span>

              <span className={styles.mapMeta}>
                {durationMin
                  ? `${Math.round(durationMin)} min`
                  : ""}
                {distanceKm
                  ? ` • ${distanceKm.toFixed(1)} km`
                  : ""}
              </span>
            </div>

            <div className={styles.mapBody}>
              <RouteMap
                stage={stage}
                store={storePoint}
                customer={customerPoint}
                storeTitle={storeName}
                customerTitle={customerName}
                riderTitle="Tu ubicación"
                onRoute={handleRoute}
              />
            </div>
          </div>

          {/* INSTRUCTIONS */}
          <div className={styles.instructionsCard}>
            <div className={styles.instructionsHead}>
              Instrucciones de Ruta
            </div>

            <div className={styles.stepsList}>
              {routeSteps.length === 0 ? (
                <p className={styles.stepsEmpty}>
                  Calculando ruta...
                </p>
              ) : (
                routeSteps.map((s, idx) => (
                  <div key={idx} className={styles.stepRow}>
                    <div className={styles.stepNum}>{idx + 1}</div>

                    <div className={styles.stepText}>
                      <div className={styles.stepTitle}>
                        {s.instruction}
                      </div>
                      <div className={styles.stepSub}>
                        {s.distanceKm.toFixed(1)} km
                      </div>
                    </div>

                    <div className={styles.stepArrow}>›</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>

      {/* DONE MODAL */}
      {showDoneModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.doneCard}>
            <div className={styles.doneIconWrap}>
              <div className={styles.doneIcon}>✓</div>
            </div>

            <h2 className={styles.doneTitle}>
              ¡Entrega Completada!
            </h2>

            <p className={styles.doneSub}>
              Has completado exitosamente la entrega del pedido
            </p>

            <div className={styles.earningBox}>
              <span>Ganancia de esta entrega:</span>
              <strong>Bs. {riderEarning.toFixed(2)}</strong>
            </div>

            <button
              className={styles.donePrimary}
              onClick={handleNextOrder}
            >
              Ver Siguiente Pedido
            </button>

            <button
              className={styles.doneSecondary}
              onClick={handleFinishShift}
            >
              Finalizar Turno
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
