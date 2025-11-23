import { instance } from "../utils/axios";
import  OrderItem  from "../models/orderItem.model"; 

export const OrderItemService = {
  create: async (orderItem: Omit<OrderItem, "id">): Promise<OrderItem> => {
    const res = await instance.post("/order-item", orderItem);
    return res.data;
  },

  getAll: async (): Promise<OrderItem[]> => {
    const res = await instance.get("/order-item");
    return res.data;
  },

  getById: async (id: number): Promise<OrderItem> => {
    const res = await instance.get(`/order-item/${id}`);
    return res.data;
  },

  update: async (id: number, orderItem: Partial<OrderItem>): Promise<OrderItem> => {
    const res = await instance.put(`/order-item/${id}`, orderItem);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await instance.delete(`/order-item/${id}`);
  },
};