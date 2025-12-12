import { instance } from "../utils/axios";
import type SupportMessage from "../models/supportMessage.model";

export const SupportMessageService = {
  // Crear un nuevo mensaje de soporte
  // POST /support-messages
  create: async (data: Omit<SupportMessage, "id" | "sentAt">): Promise<SupportMessage> => {
    const res = await instance.post("/support-messages", data);
    return res.data;
  },

  // Obtener todos los mensajes
  // GET /support-messages
  findAll: async (): Promise<SupportMessage[]> => {
    const res = await instance.get("/support-messages");
    return res.data;
  },

  // Obtener un mensaje por ID
  // GET /support-messages/:id
  findOne: async (id: number): Promise<SupportMessage> => {
    const res = await instance.get(`/support-messages/${id}`);
    return res.data;
  },

  // Actualizar un mensaje
  // PATCH /support-messages/:id
  update: async (id: number, data: Partial<SupportMessage>): Promise<SupportMessage> => {
    const res = await instance.patch(`/support-messages/${id}`, data);
    return res.data;
  },

  // Eliminar un mensaje
  // DELETE /support-messages/:id
  remove: async (id: number): Promise<void> => {
    await instance.delete(`/support-messages/${id}`);
  },
};