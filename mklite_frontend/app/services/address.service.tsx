import { instance } from "../utils/axios";
import type AddressModel from "../models/address.model";

export const AddressService = {
  // Obtener todas las direcciones (El backend infiere el usuario por token/sesión)
  // GET /address
  getAll: async (): Promise<AddressModel[]> => {
    const res = await instance.get("/address");
    return res.data;
  },

  // Obtener una dirección por ID
  // GET /address/:id
  getById: async (id: number): Promise<AddressModel> => {
    const res = await instance.get(`/address/${id}`);
    return res.data;
  },

  // Crear una nueva dirección
  // POST /address
  create: async (address: Omit<AddressModel, "id">): Promise<AddressModel> => {
    const res = await instance.post("/address", address);
    return res.data;
  },

  // Actualizar una dirección
  // PATCH /address/:id (Nota: Controlador usa PATCH, no PUT)
  update: async (id: number, updateData: Partial<AddressModel>): Promise<AddressModel> => {
    const res = await instance.patch(`/address/${id}`, updateData);
    return res.data;
  },

  // Eliminar una dirección
  // DELETE /address/:id
  delete: async (id: number): Promise<void> => {
    await instance.delete(`/address/${id}`);
  },
};