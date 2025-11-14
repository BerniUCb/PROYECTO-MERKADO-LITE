import { instance } from "../utils/axios";
import Pedido from "../models/order.model";

export const PedidoService = {
  create: async (data: Pedido): Promise<Pedido> => {
    const res = await instance.post("/pedido", data);
    return res.data;
  },

  getAll: async (): Promise<Pedido[]> => {
    const res = await instance.get("/pedido");
    return res.data;
  },

  getById: async (id: number): Promise<Pedido> => {
    const res = await instance.get(`/pedido/${id}`);
    return res.data;
  },

  update: async (id: number, data: Partial<Pedido>): Promise<Pedido> => {
    const res = await instance.patch(`/pedido/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await instance.delete(`/pedido/${id}`);
  },
};
