import { instance } from "../utils/axios";
import type Shipment from "../models/shipment.model";

/* =========================
   Types
========================= */
export interface PaginatedShipments {
  total: number;
  page: number;
  limit: number;
  data: Shipment[];
}

/* =========================
   Service
========================= */
export const ShipmentService = {
  /* =========================
     RIDER
  ========================= */

  // 🔥 Pedidos disponibles para riders
  getAvailable: async (): Promise<Shipment[]> => {
    const res = await instance.get("/shipments/available");
    return res.data;
  },

  // 🔥 Pedidos asignados a un rider (activos + historial)
  getByDriver: async (driverId: number): Promise<Shipment[]> => {
    const res = await instance.get(`/shipments/by-driver/${driverId}`);
    return res.data;
  },

  // 🔥 Historial ENTREGADO del rider (paginado)
  getDriverHistory: async (
    driverId: number,
    page = 1,
    limit = 10
  ): Promise<PaginatedShipments> => {
    const res = await instance.get(
      `/shipments/driver/${driverId}/history`,
      { params: { page, limit } }
    );
    return res.data;
  },

  /* =========================
     CRUD GENERAL
  ========================= */

  getAll: async (): Promise<Shipment[]> => {
    const res = await instance.get("/shipments");
    return res.data;
  },

  getById: async (id: number): Promise<Shipment> => {
    const res = await instance.get(`/shipments/${id}`);
    return res.data;
  },

  create: async (
    data: {
      orderId: number;
      deliveryAddressId: number;
      deliveryDriverId?: number;
      estimatedDeliveryAt?: string;
    }
  ): Promise<Shipment> => {
    const res = await instance.post("/shipments", data);
    return res.data;
  },

  update: async (
    id: number,
    shipment: Partial<Shipment>
  ): Promise<Shipment> => {
    const res = await instance.patch(`/shipments/${id}`, shipment);
    return res.data;
  },

  // 🔥 Confirmar retiro / entrega
  updateStatus: async (
    id: number,
    status: "processing" | "shipped" | "delivered" | "cancelled"
  ): Promise<Shipment> => {
    const res = await instance.patch(`/shipments/${id}/status`, {
      status,
    });
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await instance.delete(`/shipments/${id}`);
  },
};
