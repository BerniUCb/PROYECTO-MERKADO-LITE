import { instance } from "../utils/axios";
import Lot from "../models/lot.model";

export const LotService = {
  create: async (lot: Lot): Promise<Lot> => {
    const res = await instance.post("/lot", lot);
    return res.data;
  },

  getAll: async (): Promise<Lot[]> => {
    const res = await instance.get("/lot");
    return res.data;
  },

  getById: async (id: number): Promise<Lot> => {
    const res = await instance.get(`/lot/${id}`);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await instance.delete(`/lot/${id}`);
  },

  update: async (id: number, lot: Partial<Lot>): Promise<Lot> => {
    const res = await instance.put(`/lot/${id}`, lot);
    return res.data;
  },
};
