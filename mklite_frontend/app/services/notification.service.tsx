import { instance } from "../utils/axios";
import Notification, { NotificationType, RecipientRole } from "../models/notification.model";

export const NotificationService = {
  // ⭐ Obtener todas las notificaciones
  getAll: async (): Promise<Notification[]> => {
    const res = await instance.get("/notifications");
    return res.data;
  },

  // ⭐ Obtener todas las notificaciones del CLIENTE
  getClientNotifications: async (): Promise<Notification[]> => {
    const res = await instance.get("/notifications/all-by-role?role=Client");
    return res.data;
  },

  // ⭐ Obtener notificaciones NO leídas del CLIENTE
  getUnreadClientNotifications: async (): Promise<Notification[]> => {
    const res = await instance.get("/notifications/unread-by-role?role=Client");
    return res.data;
  },

  // ⭐ Obtener todas las notificaciones del ADMIN
  getAdminNotifications: async (): Promise<Notification[]> => {
    const res = await instance.get("/notifications/all-by-role?role=Admin");
    return res.data;
  },

  // ⭐ Obtener solo no leídas del ADMIN
  getUnreadAdminNotifications: async (): Promise<Notification[]> => {
    const res = await instance.get("/notifications/unread-by-role?role=Admin");
    return res.data;
  },

  // ⭐ Obtener todas las notificaciones del RIDER/DRIVER
  getDriverNotifications: async (): Promise<Notification[]> => {
    const res = await instance.get("/notifications/all-by-role?role=DeliveryDriver");
    return res.data;
  },

  // ⭐ Obtener notificaciones NO leídas del RIDER/DRIVER
  getUnreadDriverNotifications: async (): Promise<Notification[]> => {
    const res = await instance.get("/notifications/unread-by-role?role=DeliveryDriver");
    return res.data;
  },

  // ⭐ Obtener notificaciones por usuario
  getByUserId: async (userId: number): Promise<Notification[]> => {
    const res = await instance.get(`/notifications/user/${userId}`);
    return res.data;
  },

  // ⭐ Obtener notificaciones no leídas por rol (método genérico)
  getUnreadByRole: async (role: RecipientRole): Promise<Notification[]> => {
    const res = await instance.get(`/notifications/unread-by-role?role=${role}`);
    return res.data;
  },

  // ⭐ Obtener por TIPO (order, promos, inventario, etc.)
  getByType: async (type: NotificationType): Promise<Notification[]> => {
    const res = await instance.get(`/notifications/by-type?type=${type}`);
    return res.data;
  },

  // ⭐ Marcar como leída
  markAsRead: async (id: number): Promise<Notification> => {
    const res = await instance.patch(`/notifications/${id}/read`);
    return res.data;
  },

  // ⭐ Eliminar notificación
  delete: async (id: number): Promise<void> => {
    await instance.delete(`/notifications/${id}`);
  },
};