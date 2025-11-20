// services/address.service.ts

import { instance } from "../utils/axios";
import type AddressModel from "../models/address.model";

export const AddressService = {
  // Obtener todas las direcciones de un user
  getByUserId: async (userId: number): Promise<AddressModel[]> => {
    const res = await instance.get(`/user/${userId}/address`);
    return res.data;
  },

  // Obtener una dirección por ID
  getById: async (id: number): Promise<AddressModel> => {
    const res = await instance.get(`/address/${id}`);
    return res.data;
  },

  // Crear una nueva dirección
  create: async (userId: number, address: Omit<AddressModel, "id" | "userId"> ): Promise<AddressModel> => {
    const res = await instance.post(`/user/${userId}/address`, address);
    return res.data;
  },

  // Actualizar una dirección
  update: async (id: number, updateData: Partial<AddressModel>): Promise<AddressModel> => {
    const res = await instance.put(`/address/${id}`, updateData);
    return res.data;
  },

  // Eliminar una dirección
  delete: async (id: number): Promise<void> => {
    await instance.delete(`/address/${id}`);
  },

  // Marcar una dirección como predeterminada
  setDefault: async (userId: number, addressId: number): Promise<void> => {
    await instance.put(`/user/${userId}/address/${addressId}/default`);
  },
};
