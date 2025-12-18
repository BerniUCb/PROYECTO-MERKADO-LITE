"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./page.module.css";

import RouteMap, { type RouteStep } from "../../components/RouteMap";

import {
  ShipmentService,
  type Shipment,
} from "../../../services/shipment.service";

// ----------------------------
// Types
// ----------------------------
type RiderStage = "PENDING_PICKUP" | "ON_THE_WAY";

// ----------------------------
// Helpers
// ----------------------------
function shipmentToView(shipment: Shipment) {
  const addr = shipment.deliveryAddress;

  return {
  id: shipment.id,
  createdAt:
    shipment.order.createdAt ?? new Date().toISOString(),

  status: shipment.status,

  user: shipment.order.user,

  items: shipment.order.items.map((it: any) => ({
    ...it,
    quantity: Number(it.quantity),
    unitPrice: Number(it.unitPrice),
  })),

  orderTotal: shipment.order.items.reduce(
    (acc: number, it: any) =>
      acc +
      Number(it.quantity) * Number(it.unitPrice),
    0
  ),

  store: {
    name: "MERKADO LITE",
    location: {
      lat: -17.374063,
      lng: -66.167678,
      address1: "Tienda",
      address2: "",
    },
  },

  customerLocation: {
    lat: addr.latitude ?? 0,
    lng: addr.longitude ?? 0,
    address1: `${addr.street} ${addr.streetNumber}`,
    address2: `${addr.city}, ${addr.state}`,
  },
};
}

// ----------------------------
// Page
// ----------------------------
export default function RiderDeliveryPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const shipmentId = Number(params.id);

  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [stage, setStage] = useState<RiderStage>("PENDING_PICKUP");
  const [showDoneModal, setShowDoneModal] = useState(false);

  const [routeSteps, setRouteSteps] = useState<RouteStep[]>([]);
  const [distanceKm, setDistanceKm] = useState(0);
  const [durationMin, setDurationMin] = useState(0);

  // ----------------------------
  // Load shipment
  // ----------------------------
  useEffect(() => {
    const load = async () => {
      try {
        const data = await ShipmentService.getById(shipmentId);
        setShipment(data);

        if (data.status === "shipped") {
          setStage("ON_THE_WAY");
        }
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [shipmentId]);

  const order = useMemo(
    () => (shipment ? shipmentToView(shipment) : null),
    [shipment]
  );

  const handleRoute = useCallback(
    (data: {
      steps: RouteStep[];
      distanceKm: number;
      durationMin: number;
    }) => {
      setRouteSteps(data.steps);
      setDistanceKm(data.distanceKm);
      setDurationMin(data.durationMin);
    },
    []
  );

  if (!order) {
    return (
      <div className={styles.notFound}>
        <p>Cargando pedido...</p>
      </div>
    );
  }

  // ----------------------------
  // Actions (BACKEND REAL)
  // ----------------------------
  const handleConfirmPickup = async () => {
    try {
      await ShipmentService.updateStatus(shipmentId, "shipped");
      setStage("ON_THE_WAY");
    } catch (err) {
      console.error(err);
      alert("No se pudo confirmar el retiro");
    }
  };

  const handleConfirmDelivery = async () => {
    try {
      await ShipmentService.updateStatus(shipmentId, "delivered");
      setShowDoneModal(true);
    } catch (err) {
      console.error(err);
      alert("No se pudo confirmar la entrega");
    }
  };

  // ----------------------------
  // Derived
  // ----------------------------
  const customerName = order.user.fullName;
  const customerPhone = order.user.phone;

  const storePoint = order.store.location;
  const customerPoint = order.customerLocation;

  const headerLabel =
    stage === "PENDING_PICKUP"
      ? "Pendiente de retiro"
      : "Retirado (en camino)";

  // ----------------------------
  // Render
  // ----------------------------
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
          <span className={styles.topStatusText}>
            {headerLabel}
          </span>
        </div>
      </div>

      <div className={styles.layout}>
        {/* LEFT */}
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
              <h3 className={styles.bigTitle}>
                {order.store.name}
              </h3>

              <p className={styles.line}>
                📍 {order.store.location.address1}
              </p>

              <p className={styles.line}>📞 {customerPhone}</p>

              {stage === "PENDING_PICKUP" ? (
                <button
                  className={styles.primaryRed}
                  onClick={handleConfirmPickup}
                >
                  Confirmar retiro
                </button>
              ) : (
                <button
                  className={styles.primaryPicked}
                  disabled
                >
                  ✓ Recogido
                </button>
              )}
            </div>
          </div>

          {/* DELIVERY */}
          <div className={styles.card}>
            <div
              className={`${styles.cardHead} ${styles.headGreen}`}
            >
              Entregar a
            </div>

            <div className={styles.cardBody}>
              <h3 className={styles.bigTitle}>
                {customerName}
              </h3>

              <p className={styles.line}>
                📍 {order.customerLocation.address1}
              </p>

              <p className={styles.line}>📞 {customerPhone}</p>

              {stage === "ON_THE_WAY" && (
                <button
                  className={styles.primaryGreen}
                  onClick={handleConfirmDelivery}
                >
                  Confirmar entrega
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* RIGHT */}
        <section className={styles.rightCol}>
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
                storeTitle={order.store.name}
                customerTitle={customerName}
                riderTitle="Tu ubicación"
                onRoute={handleRoute}
              />
            </div>
          </div>

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
                  <div
                    key={idx}
                    className={styles.stepRow}
                  >
                    <div className={styles.stepNum}>
                      {idx + 1}
                    </div>

                    <div className={styles.stepText}>
                      <div className={styles.stepTitle}>
                        {s.instruction}
                      </div>
                      <div className={styles.stepSub}>
                        {s.distanceKm.toFixed(1)} km
                      </div>
                    </div>
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
            <h2 className={styles.doneTitle}>
              ¡Entrega Completada!
            </h2>

            <button
              className={styles.donePrimary}
              onClick={() => router.push("/rider")}
            >
              Volver a pedidos
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
