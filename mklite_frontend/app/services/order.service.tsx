import { instance } from "../utils/axios";
import Order from "../models/order.model";

export const OrderService = {
  create: async (data: Order): Promise<Order> => {
    const res = await instance.post("/order", data);
    return res.data;
  },

  getAll: async (): Promise<Order[]> => {
    const res = await instance.get("/order");
    return res.data;
  },

  getById: async (id: number): Promise<Order> => {
    const res = await instance.get(`/order/${id}`);
    return res.data;
  },

  update: async (id: number, data: Partial<Order>): Promise<Order> => {
    const res = await instance.patch(`/order/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await instance.delete(`/order/${id}`);
  },
};
