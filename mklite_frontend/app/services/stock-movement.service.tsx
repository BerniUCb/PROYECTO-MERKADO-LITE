import { instance } from "../utils/axios";
import StockMovement from "../models/stockMovement.model";

export const StockMovementService = {
  create: async (data: Omit<StockMovement, "id">): Promise<StockMovement> => {
    const res = await instance.post("/stock-movements", data);
    return res.data;
  },

  getAll: async (
    page?: number,
    limit?: number,
    sort?: string,
    order?: "asc" | "desc"
  ): Promise<StockMovement[]> => {
    const params = { page, limit, sort, order };
    const res = await instance.get("/stock-movements", { params });
    return res.data;
  },

  getById: async (id: number): Promise<StockMovement> => {
    const res = await instance.get(`/stock-movements/${id}`);
    return res.data;
  },

  update: async (id: number, data: Partial<StockMovement>): Promise<StockMovement> => {
    const res = await instance.patch(`/stock-movements/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await instance.delete(`/stock-movements/${id}`);
  },
};