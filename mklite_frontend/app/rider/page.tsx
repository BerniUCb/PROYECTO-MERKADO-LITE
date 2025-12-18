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
} from "@/app/services/shipment.service";
import {
  StoreService,
  type StoreLocation,
} from "@/app/services/store.service";

// ---------------- Helpers ----------------

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
  const items: RiderOrder["items"] = s.order.items.map((it) => ({
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
    paymentMethod: s.order.paymentMethod ?? "Efectivo",

    user: {
      id: s.order.user.id,
      fullName: s.order.user.fullName,
      email: s.order.user.email,
      phone: s.order.user.phone,
    },

    items,

    store: {
      name: store.name,
      location: {
        lat: Number(store.lat),
        lng: Number(store.lng),
        address1: store.address1,
        address2: store.address2,
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

// ---------------- Page ----------------

export default function RiderHomePage() {
  const router = useRouter();

  const [store, setStore] = useState<StoreLocation | null>(null);
  const [orders, setOrders] = useState<RiderOrder[]>([]);
  const [selectedOrder, setSelectedOrder] =
    useState<RiderOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 📍 Load store
  useEffect(() => {
    (async () => {
      try {
        const data = await StoreService.getLocation();
        setStore(data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // 📦 Load shipments
  useEffect(() => {
    if (!store) return;

    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErrorMsg(null); // Limpiar errores previos
        const shipments = await ShipmentService.getAvailable();

        if (!alive) return;

        setOrders(shipments.map((s) =>
          shipmentToRiderOrder(s, store)
        ));
      } catch {
        if (!alive) return;
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

  // Limpiar error cuando se selecciona un nuevo pedido
  useEffect(() => {
    if (selectedOrder) {
      setErrorMsg(null);
    }
  }, [selectedOrder]);

  const hasOrders = useMemo(() => orders.length > 0, [orders]);

  const handleAccept = async (shipmentId: number) => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) {
        setErrorMsg("No se encontró información del usuario");
        return;
      }

      const user = JSON.parse(raw);
      
      // Deshabilitar el botón mientras se procesa
      setAccepting(true);
      setErrorMsg(null); // Limpiar errores previos
      
      await ShipmentService.assign(shipmentId, user.id);

      // Redirigir a la página de entrega
      router.push(`/rider/delivery/${shipmentId}`);
    } catch (error: any) {
      console.error("Error al aceptar pedido:", error);
      
      // Manejar diferentes tipos de errores
      if (error?.response?.status === 409) {
        setErrorMsg("Este pedido ya fue asignado a otro repartidor");
      } else if (error?.response?.status === 404) {
        setErrorMsg("El pedido no fue encontrado");
      } else if (error?.response?.status === 400) {
        setErrorMsg("Error en la solicitud. Por favor, intenta nuevamente");
      } else {
        setErrorMsg("Error al aceptar el pedido. Por favor, intenta nuevamente");
      }
      
      setAccepting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Bienvenido</h1>

      <section className={styles.content}>
        <div className={styles.card}>
          <header className={styles.cardHeader}>
            Pedidos disponibles
          </header>

          <div className={styles.cardBody}>
            {loading ? (
              <p>Cargando pedidos...</p>
            ) : errorMsg ? (
              <p>{errorMsg}</p>
            ) : !hasOrders ? (
              <p>No hay pedidos disponibles</p>
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
          accepting={accepting}
          errorMsg={errorMsg}
        />
      </section>
    </div>
  );
}
