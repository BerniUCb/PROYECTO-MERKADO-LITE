// src/services/envio.service.ts
import { instance } from "../utils/axios";
import type EnvioModel from "../models/shipment.model";

export const EnvioService = {
  getAll: async (): Promise<EnvioModel[]> => {
    const res = await instance.get("/envio");
    return res.data;
  },

  getById: async (id: number): Promise<EnvioModel> => {
    const res = await instance.get(`/envio/${id}`);
    return res.data;
  },

  getByUser: async (userId: number): Promise<EnvioModel[]> => {
    const res = await instance.get(`/user/${userId}/envios`);
    return res.data;
  },

  create: async (
    envio: Partial<EnvioModel> // requiere direccionId y usuarioId
  ): Promise<EnvioModel> => {
    const res = await instance.post("/envio", envio);
    return res.data;
  },

  update: async (
    id: number,
    envio: Partial<EnvioModel>
  ): Promise<EnvioModel> => {
    const res = await instance.put(`/envio/${id}`, envio);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await instance.delete(`/envio/${id}`);
  },
};
