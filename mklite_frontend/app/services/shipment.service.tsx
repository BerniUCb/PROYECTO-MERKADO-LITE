// app/services/shipment.service.tsx
import { instance } from "@/app/utils/axios";

/**
 * Estados reales del backend
 */
export type ShipmentStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

/**
 * Shape REAL del backend
 * (alineado con ShipmentEntity + relations)
 */
export type Shipment = {
  id: number;
  status: ShipmentStatus;

  assignedAt?: string | null;
  deliveredAt?: string | null;
  estimatedDelivery?: string | null;

  order: {
    id: number;
    createdAt?: string;
    paymentMethod?: string;

    user: {
      id: number;
      fullName: string;
      email: string;
      phone: string;
    };

    items: Array<{
      id: number;
      quantity: number;
      unitPrice: number | string;
      product?: {
        id: number;
        name: string;
      };
    }>;
  };

  deliveryAddress: {
    id: number;
    latitude: number | null;
    longitude: number | null;
    street: string;
    streetNumber: string;
    city: string;
    state: string;
  };

  deliveryDriver?: {
    id: number;
  } | null;
};

/**
 * Respuesta paginada para historial
 */
export interface PaginatedShipments {
  total: number;
  page: number;
  limit: number;
  data: Shipment[];
}

export const ShipmentService = {
  // =========================
  // 🟢 Rider – pedidos disponibles
  // =========================
  getAvailable: async (): Promise<Shipment[]> => {
    const res = await instance.get("/shipments/available");
    return res.data;
  },

  // =========================
  // 🟢 Obtener shipment por ID
  // =========================
  getById: async (id: number): Promise<Shipment> => {
    const res = await instance.get(`/shipments/${id}`);
    return res.data;
  },

  // =========================
  // 🟢 Pedidos del rider (activos)
  // =========================
  getByDriver: async (driverId: number): Promise<Shipment[]> => {
    const res = await instance.get(`/shipments/by-driver/${driverId}`);
    return res.data;
  },

  // =========================
  // 🟢 Historial del rider (ENTREGADOS)
  // =========================
  getDriverHistory: async (
    driverId: number,
    page = 1,
    limit = 10
  ): Promise<PaginatedShipments> => {
    const res = await instance.get(
      `/shipments/driver/${driverId}/history`,
      {
        params: { page, limit },
      }
    );
    return res.data;
  },

  // =========================
  // 🟢 Aceptar pedido
  // =========================
  assign: async (
    shipmentId: number,
    driverId: number
  ): Promise<Shipment> => {
    const res = await instance.patch(
      `/shipments/${shipmentId}/assign`,
      {
        driverId,
        status: "processing",
      }
    );
    return res.data;
  },

  // =========================
  // 🟢 Cambiar estado
  // =========================
  updateStatus: async (
    shipmentId: number,
    status: ShipmentStatus
  ): Promise<Shipment> => {
    const res = await instance.patch(
      `/shipments/${shipmentId}/status`,
      { status }
    );
    return res.data;
  },
};
