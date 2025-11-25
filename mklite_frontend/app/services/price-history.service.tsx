import { instance } from "../utils/axios";
import PriceHistory from "../models/priceHistory.model";

export const PriceHistoryService = {
  // POST /price-history
  create: async (data: Omit<PriceHistory, "id">): Promise<PriceHistory> => {
    const res = await instance.post("/price-history", data);
    return res.data;
  },

  // GET /price-history
  getAll: async (): Promise<PriceHistory[]> => {
    const res = await instance.get("/price-history");
    return res.data;
  },

  // GET /price-history/:id
  getById: async (id: number): Promise<PriceHistory> => {
    const res = await instance.get(`/price-history/${id}`);
    return res.data;
  },

  // GET /price-history/product/:productId
  getByProductId: async (productId: number): Promise<PriceHistory[]> => {
    const res = await instance.get(`/price-history/product/${productId}`);
    return res.data;
  },

  // DELETE /price-history/:id
  delete: async (id: number): Promise<void> => {
    await instance.delete(`/price-history/${id}`);
  },
};