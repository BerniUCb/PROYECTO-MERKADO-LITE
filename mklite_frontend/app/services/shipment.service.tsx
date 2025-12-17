import { instance } from "../utils/axios";
import type Shipment from "../models/shipment.model";

export interface PaginatedShipments {
  total: number;
  page: number;
  limit: number;
  data: Shipment[];
}

export const ShipmentService = {
  getAll: async (): Promise<Shipment[]> => {
    const res = await instance.get("/shipment");
    return res.data;
  },

  getById: async (id: number): Promise<Shipment> => {
    const res = await instance.get(`/shipment/${id}`);
    return res.data;
  },

  getByUser: async (userId: number): Promise<Shipment[]> => {
    const res = await instance.get(`/user/${userId}/shipments`);
    return res.data;
  },

  create: async (
    shipment: Omit<
      Shipment,
      "id" | "assignedAt" | "estimatedDelivery" | "deliveredAt"
    >
  ): Promise<Shipment> => {
    const res = await instance.post("/shipment", shipment);
    return res.data;
  },

  update: async (
    id: number,
    shipment: Partial<Shipment>
  ): Promise<Shipment> => {
    const res = await instance.put(`/shipment/${id}`, shipment);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await instance.delete(`/shipment/${id}`);
  },

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

  // ===============================
  // 🔽 NUEVO (NO ROMPE NADA)
  // ===============================

  // 🔹 Shipments disponibles para repartidor
  getAvailable: async (): Promise<Shipment[]> => {
    const res = await instance.get("/shipments/available");
    return res.data;
  },

  // 🔹 Shipments asignados a un repartidor
  getByDriver: async (driverId: number): Promise<Shipment[]> => {
    const res = await instance.get(`/shipments/by-driver/${driverId}`);
    return res.data;
  },

  // 🔹 Actualizar estado del envío
  updateStatus: async (
    shipmentId: number,
    status: string
  ): Promise<Shipment> => {
    const res = await instance.patch(`/shipments/${shipmentId}/status`, {
      status,
    });
    return res.data;
  },
};
