import { instance } from "../utils/axios";
import Proveedor  from "../models/ provider.model";

export const ProviderService = {
  create: async (proveedor: Proveedor): Promise<Proveedor> => {
    const res = await instance.post("/provider", proveedor);
    return res.data;
  },

  getAll: async (): Promise<Proveedor[]> => {
    const res = await instance.get("/provider");
    return res.data;
  },

  getById: async (id: string): Promise<Proveedor> => {
    const res = await instance.get(`/provider/${id}`);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await instance.delete(`/provider/${id}`);
  },

  update: async (id: string, proveedor: Proveedor): Promise<Proveedor> => {
    const res = await instance.put(`/provider/${id}`, proveedor);
    return res.data;
  },
};
