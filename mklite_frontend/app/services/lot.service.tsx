import { instance } from "../utils/axios";
import Lote from "../models/lot.model";

export const LotService = {
  create: async (lote: Lote): Promise<Lote> => {
    const res = await instance.post("/lotes", lote);
    return res.data;
  },

  getAll: async (): Promise<Lote[]> => {
    const res = await instance.get("/lotes");
    return res.data;
  },

  getById: async (id: number): Promise<Lote> => {
    const res = await instance.get(`/lotes/${id}`);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await instance.delete(`/lotes/${id}`);
  },

  update: async (id: number, lote: Partial<Lote>): Promise<Lote> => {
    const res = await instance.put(`/lotes/${id}`, lote);
    return res.data;
  },
};
