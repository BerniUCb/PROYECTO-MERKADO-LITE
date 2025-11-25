import { instance } from "../utils/axios";
import Supplier from "../models/supplier.model";

export const SupplierService = {
  create: async (supplier: Omit<Supplier, "id" | "lots">): Promise<Supplier> => {
    const res = await instance.post("/supplier", supplier);
    return res.data;
  },

  getAll: async (): Promise<Supplier[]> => {
    const res = await instance.get("/supplier");
    return res.data;
  },

  getById: async (id: number): Promise<Supplier> => {
    const res = await instance.get(`/supplier/${id}`);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await instance.delete(`/supplier/${id}`);
  },

  update: async (id: number, supplier: Partial<Supplier>): Promise<Supplier> => {
    const res = await instance.put(`/supplier/${id}`, supplier);
    return res.data;
  },
};