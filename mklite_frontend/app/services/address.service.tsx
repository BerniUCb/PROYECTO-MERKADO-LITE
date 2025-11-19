// services/direccion.service.ts

import { instance } from "../utils/axios";
import type DireccionModel from "../models/address.model";

export const DireccionService = {
  // Obtener todas las direcciones de un usuario
  getByUserId: async (usuarioId: number): Promise<DireccionModel[]> => {
    const res = await instance.get(`/users/${usuarioId}/direccion`);
    return res.data;
  },

  // Obtener una dirección por ID
  getById: async (id: number): Promise<DireccionModel> => {
    const res = await instance.get(`/direccion/${id}`);
    return res.data;
  },

  // Crear una nueva dirección
  create: async (usuarioId: number, direccion: Omit<DireccionModel, "id" | "usuarioId"> ): Promise<DireccionModel> => {
    const res = await instance.post(`/users/${usuarioId}/direccion`, direccion);
    return res.data;
  },

  // Actualizar una dirección
  update: async (id: number, updateData: Partial<DireccionModel>): Promise<DireccionModel> => {
    const res = await instance.put(`/direccion/${id}`, updateData);
    return res.data;
  },

  // Eliminar una dirección
  delete: async (id: number): Promise<void> => {
    await instance.delete(`/direccion/${id}`);
  },

  // Marcar una dirección como predeterminada
  setDefault: async (usuarioId: number, direccionId: number): Promise<void> => {
    await instance.put(`/users/${usuarioId}/direccion/${direccionId}/default`);
  },
};
