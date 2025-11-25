import { instance } from "../utils/axios";
import Payment from "../models/payment.model";

export const PaymentService = {
  // POST /payment
  create: async (payment: Omit<Payment, "id">): Promise<Payment> => {
    const res = await instance.post("/payment", payment);
    return res.data;
  },

  // GET /payment
  getAll: async (): Promise<Payment[]> => {
    const res = await instance.get("/payment");
    return res.data;
  },

  // GET /payment/:id
  getById: async (id: number): Promise<Payment> => {
    const res = await instance.get(`/payment/${id}`);
    return res.data;
  },

  // PUT /payment/:id
  update: async (id: number, payment: Partial<Payment>): Promise<Payment> => {
    const res = await instance.put(`/payment/${id}`, payment);
    return res.data;
  },

  // DELETE /payment/:id
  delete: async (id: number): Promise<void> => {
    await instance.delete(`/payment/${id}`);
  },
};