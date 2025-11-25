import { instance } from "../utils/axios";
import Order from "../models/order.model";

export const OrderService = {
  // --- REPORTES ---
  getTotalSales: async () => {
    const res = await instance.get("/orders/report/total-sales");
    return res.data;
  },

  getPendingOrderCount: async () => {
    const res = await instance.get("/orders/report/pending-count");
    return res.data;
  },

  getTotalOrdersCount: async (): Promise<number> => {
    const res = await instance.get("/orders/report/total-count");
    return res.data.totalOrders;
  },

  // NUEVO: Para la tarjeta "Cancelados"
  getCancelledOrderCount: async (): Promise<number> => {
    const res = await instance.get("/orders/report/cancelled-count-");
    return res.data.cancelled;
  },

  getWeeklySales: async () => {
    const res = await instance.get("/orders/report/weekly-sales");
    return res.data;
  },

  getLatestOrders: async () :Promise<Order[]> => {
    const res = await instance.get("/orders/report/latest");
    return res.data;
  },
  
  getLast7DaysSales: async (): Promise<number[]> => {
    const res = await instance.get("/orders/stats/last-7-days");
    return res.data;
  },

  // --- CRUD ---
  create: async (data: Omit<Order, "id" |"items">): Promise<Order> => {
    const res = await instance.post("/orders", data);
    return res.data;
  },

  getAll: async (
    page?: number,
    limit?: number,
    sort?: string,
    order?: "asc" | "desc"
  ): Promise<Order[]> => {
    const params = { page, limit, sort, order };
    const res = await instance.get("/orders", { params });
    return res.data;
  },

  getById: async (id: number): Promise<Order> => {
    const res = await instance.get(`/orders/${id}`);
    return res.data;
  },

  update: async (id: number, data: Partial<Order>): Promise<Order> => {
    // Controlador usa PATCH
    const res = await instance.patch(`/orders/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await instance.delete(`/orders/${id}`);
  },
};