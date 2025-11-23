import { instance } from "../utils/axios";
import SupportTicket from "../models/supportTicket.model";

export const SupportTicketService = {
  /*
  create: async (data: Omit<SupportTicket, "id" | "messages">): Promise<SupportTicket> => {
    const res = await instance.post("/support-ticket", data);
    return res.data;
  },
  */

  getAll: async (): Promise<SupportTicket[]> => {
    const res = await instance.get("/support-ticket");
    return res.data;
  },

  getById: async (id: number): Promise<SupportTicket> => {
    const res = await instance.get(`/support-ticket/${id}`);
    return res.data;
  },

  update: async (id: number, data: Partial<SupportTicket>): Promise<SupportTicket> => {
    const res = await instance.put(`/support-ticket/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await instance.delete(`/support-ticket/${id}`);
  },
};