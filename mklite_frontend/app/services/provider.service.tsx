import { instance } from "../utils/axios";
import Supplier  from "../models/supplier.model";

export const SupplierService = {
  create: async (supplier: Supplier): Promise<Supplier> => {
    const res = await instance.post("/supplier", supplier);
    return res.data;
  },

  getAll: async (): Promise<Supplier[]> => {
    const res = await instance.get("/supplier");
    return res.data;
  },

  getById: async (id: string): Promise<Supplier> => {
    const res = await instance.get(`/supplier/${id}`);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await instance.delete(`/supplier/${id}`);
  },

  update: async (id: string, supplier: Supplier): Promise<Supplier> => {
    const res = await instance.put(`/supplier/${id}`, supplier);
    return res.data;
  },
};
