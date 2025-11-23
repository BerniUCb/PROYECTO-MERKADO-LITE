import { instance } from "../utils/axios";
import type Promotion from "../models/promotion.model";

export const PromotionService = {
  getAll: async (): Promise<Promotion[]> => {
    const res = await instance.get("/promotion");
    return res.data;
  },

  getById: async (id: number): Promise<Promotion> => {
    const res = await instance.get(`/promotion/${id}`);
    return res.data;
  },

  create: async (promotion: Omit<Promotion, "id">): Promise<Promotion> => {
    const res = await instance.post("/promotion", promotion);
    return res.data;
  },

  update: async (id: number, promotion: Partial<Promotion>): Promise<Promotion> => {
    const res = await instance.put(`/promotion/${id}`, promotion);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await instance.delete(`/promotion/${id}`);
  },
};