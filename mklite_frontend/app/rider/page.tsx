"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

import type { RiderOrder } from "./mockOrders";
import OrdersTable from "./components/OrdersTable";
import OrderDetailCard from "./components/OrderDetailCard";
import { useRouter } from "next/navigation";

import {
  ShipmentService,
  type Shipment,
} from "../services/shipment.service";

// --------------------------------------------------
// Helpers
// --------------------------------------------------

function mapStatus(status: Shipment["status"]): RiderOrder["status"] {
  switch (status) {
    case "pending":
      return "Disponible";
    case "processing":
    case "shipped":
      return "En proceso";
    case "delivered":
      return "Entregado";
    default:
      return "En proceso";
  }
}

function calcTotal(items: RiderOrder["items"]): number {
  return items.reduce(
    (acc, it) => acc + it.quantity * it.unitPrice,
    0
  );
}

function shipmentToRiderOrder(s: Shipment): RiderOrder {
  const items: RiderOrder["items"] = s.order.items.map((it) => ({
    id: it.id,
    name: it.name,
    quantity: Number(it.quantity),
    unitPrice: Number(it.unitPrice),
  }));

  const addr = s.deliveryAddress;

  return {
    id: s.id,
    name: `Pedido ${s.order.id}`,
    createdAt: s.order.createdAt ?? new Date().toISOString(),

    status: mapStatus(s.status),

    orderTotal: calcTotal(items),
    paymentMethod:
      s.order.paymentMethod ?? "Cash on delivery",

    user: {
      id: s.order.user.id,
      fullName: s.order.user.fullName,
      email: s.order.user.email,
      phone: s.order.user.phone,
    },

    items,

    // Tienda (todavía no existe en backend)
    store: {
      name: "MERKADO LITE",
      location: {
        lat: 0,
        lng: 0,
        address1: "Tienda",
        address2: "",
      },
    },

    // Cliente (SALE DIRECTO DEL BACKEND)
    customerLocation: {
      lat: addr.latitude ?? 0,
      lng: addr.longitude ?? 0,
      address1: `${addr.street} ${addr.streetNumber}`,
      address2: `${addr.city}, ${addr.state}`,
    },
  };
}

// --------------------------------------------------
// Page
// --------------------------------------------------

export default function RiderHomePage() {
  const riderName = "Jp";

  const [orders, setOrders] = useState<RiderOrder[]>([]);
  const [selectedOrder, setSelectedOrder] =
    useState<RiderOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] =
    useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        const shipments =
          await ShipmentService.getAvailable();

        const mapped =
          shipments.map(shipmentToRiderOrder);

        if (!alive) return;

        setOrders(mapped);
        setSelectedOrder((prev) =>
          prev
            ? mapped.find(
                (o) => o.id === prev.id
              ) ?? null
            : null
        );
      } catch (err) {
        console.error(err);
        if (!alive) return;

        setOrders([]);
        setSelectedOrder(null);
        setErrorMsg(
          "Error cargando pedidos desde el backend"
        );
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const hasOrders = useMemo(
    () => orders.length > 0,
    [orders.length]
  );

  // --------------------------------------------------
  // Aceptar pedido (BACKEND REAL)
  // --------------------------------------------------
  const handleAccept = async (
    shipmentId: number
  ) => {
    try {
      const raw =
        localStorage.getItem("user");
      if (!raw) {
        alert("Usuario no autenticado");
        return;
      }

      const user = JSON.parse(raw);
      const driverId = user.id;

      await ShipmentService.assign(
        shipmentId,
        driverId
      );

      router.push(
        `/rider/delivery/${shipmentId}`
      );
    } catch (err: any) {
      console.error(err);
      alert(
        err?.response?.data?.message ??
          "No se pudo aceptar el pedido"
      );
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Bienvenido {riderName}
      </h1>

      <section className={styles.content}>
        {/* CARD IZQUIERDA */}
        <div className={styles.card}>
          <header className={styles.cardHeader}>
            <span className={styles.cardTitle}>
              Pedidos disponibles
            </span>
          </header>

          <div className={styles.cardBody}>
            {loading ? (
              <p>Cargando pedidos...</p>
            ) : errorMsg ? (
              <p className={styles.emptyText}>
                {errorMsg}
              </p>
            ) : !hasOrders ? (
              <p className={styles.emptyText}>
                No hay pedidos disponibles
              </p>
            ) : (
              <OrdersTable
                orders={orders}
                onSelect={(order) =>
                  setSelectedOrder(order)
                }
              />
            )}
          </div>
        </div>

        {/* CARD DERECHA */}
        <OrderDetailCard
          order={selectedOrder}
          onAccept={() => {
            if (!selectedOrder) return;
            handleAccept(selectedOrder.id);
          }}
          onContact={() =>
            alert("Contactar cliente")
          }
        />
      </section>
    </div>
  );
}
