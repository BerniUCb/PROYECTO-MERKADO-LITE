// src/services/shipment.service.ts
import { instance } from "../utils/axios";
import type Shipment from "../models/shipment.model";

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
    shipment: Partial<Shipment> // requiere direccionId y usuarioId
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
};
