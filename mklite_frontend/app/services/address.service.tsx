import { instance } from "../utils/axios";
import type AddressModel from "../models/address.model";

export const AddressService = {

  // Obtener todas las direcciones de un usuario
  getAll: async (userId: number = 1): Promise<AddressModel[]> => {
    const res = await instance.get(`/users/${userId}/address`);
    return res.data;
  },

  // Obtener una dirección específica
  getById: async (userId: number, addressId: number): Promise<AddressModel> => {
    const res = await instance.get(`/users/${userId}/address/${addressId}`);
    return res.data;
  },

  // Crear una dirección nueva
  create: async (userId: number, address: Omit<AddressModel, "id">): Promise<AddressModel> => {
    const res = await instance.post(`/users/${userId}/address`, address);
    return res.data;
  },

  // Actualizar una dirección
  update: async (userId: number, addressId: number, data: Partial<AddressModel>): Promise<AddressModel> => {
    const res = await instance.patch(`/users/${userId}/address/${addressId}`, data);
    return res.data;
  },

  // Eliminar una dirección
  delete: async (userId: number, addressId: number): Promise<void> => {
    await instance.delete(`/users/${userId}/address/${addressId}`);
  },
};
