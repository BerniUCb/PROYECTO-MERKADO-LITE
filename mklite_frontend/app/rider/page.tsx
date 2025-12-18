"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

import type { RiderOrder } from "./mockOrders";
import OrdersTable from "./components/OrdersTable";
import OrderDetailCard from "./components/OrderDetailCard";
import { useRouter } from "next/navigation";

import { ShipmentService, type Shipment } from "@/app/services/shipment.service";
import { StoreService, type StoreLocation } from "@/app/services/store.service";

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

function shipmentToRiderOrder(
  s: Shipment,
  store: StoreLocation
): RiderOrder {
  const items: RiderOrder["items"] = s.order.items.map((it: any) => ({
    id: it.id,
    name: it.product?.name ?? `Producto ${it.id}`,
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
    paymentMethod: s.order.paymentMethod ?? "Cash",

    user: {
      id: s.order.user.id,
      fullName: s.order.user.fullName,
      email: s.order.user.email,
      phone: s.order.user.phone,
    },

    items,

    // ✅ TIENDA DESDE BACKEND
    store: {
  name: store.name,
  location: {
    lat: Number(store.lat),
    lng: Number(store.lng),
    address1: store.address1,
    address2: store.address2,
  },
    },

    // ✅ CLIENTE DESDE BACKEND
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

  const [store, setStore] = useState<StoreLocation | null>(null);
  const [orders, setOrders] = useState<RiderOrder[]>([]);
  const [selectedOrder, setSelectedOrder] =
    useState<RiderOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const router = useRouter();

  // ------------------------
  // 1️⃣ Cargar tienda
  // ------------------------
  useEffect(() => {
    (async () => {
      try {
        const data = await StoreService.getLocation();
        setStore(data);
      } catch (e) {
        console.error("Error cargando store", e);
      }
    })();
  }, []);

  // ------------------------
  // 2️⃣ Cargar pedidos
  // ------------------------
  useEffect(() => {
    if (!store) return;

    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        const shipments = await ShipmentService.getAvailable();

        const mapped = shipments.map((s) =>
          shipmentToRiderOrder(s, store)
        );

        if (!alive) return;

        setOrders(mapped);
        setSelectedOrder(null);
      } catch (err) {
        console.error(err);
        if (!alive) return;

        setOrders([]);
        setSelectedOrder(null);
        setErrorMsg("Error cargando pedidos");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [store]);

  const hasOrders = useMemo(
    () => orders.length > 0,
    [orders.length]
  );

  // ------------------------
  // 3️⃣ Aceptar pedido
  // ------------------------
  const handleAccept = async (shipmentId: number) => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) {
        alert("Usuario no autenticado");
        return;
      }

      const user = JSON.parse(raw);
      await ShipmentService.assign(shipmentId, user.id);

      router.push(`/rider/delivery/${shipmentId}`);
    } catch (err: any) {
      console.error(err);
      alert(
        err?.response?.data?.message ??
          "No se pudo aceptar el pedido"
      );
    }
  };

  // ------------------------
  // Render
  // ------------------------
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Bienvenido {riderName}
      </h1>

      <section className={styles.content}>
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
              <p className={styles.emptyText}>{errorMsg}</p>
            ) : !hasOrders ? (
              <p className={styles.emptyText}>
                No hay pedidos disponibles
              </p>
            ) : (
              <OrdersTable
                orders={orders}
                onSelect={setSelectedOrder}
              />
            )}
          </div>
        </div>

        <OrderDetailCard
          order={selectedOrder}
          onAccept={() =>
            selectedOrder && handleAccept(selectedOrder.id)
          }
          onContact={() => alert("Contactar cliente")}
        />
      </section>
    </div>
  );
}
