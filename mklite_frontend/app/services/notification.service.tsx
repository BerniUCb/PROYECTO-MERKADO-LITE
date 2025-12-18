import { instance } from "../utils/axios";
import type Notification from "../models/notification.model";
import type { NotificationType, RecipientRole } from "../models/notification.model";

const NotificationService = {
  // Obtener todas las notificaciones
  // GET /notifications
  getAll: async (): Promise<Notification[]> => {
    const res = await instance.get("/notifications");
    return res.data;
  },

  // Obtener notificaciones por ID de usuario
  // GET /notifications/user/:userId
  getByUserId: async (userId: number): Promise<Notification[]> => {
    const res = await instance.get(`/notifications/user/${userId}`);
    return res.data;
  },

  // Obtener notificaciones no leídas por Rol (Admin, Client, Driver)
  // GET /notifications/unread-by-role?role=...
  getUnreadByRole: async (role: RecipientRole): Promise<Notification[]> => {
    const res = await instance.get(`/notifications/unread-by-role`, {
      params: { role }
    });
    return res.data;
  },
  
  // Obtener TODAS las notificaciones por Rol
  // GET /notifications/all-by-role?role=...
  getAllByRole: async (role: RecipientRole): Promise<Notification[]> => {
    const res = await instance.get(`/notifications/all-by-role`, {
      params: { role }
    });
    return res.data;
  },

  // Marcar como leída
  // PATCH /notifications/:id/read
  markAsRead: async (id: number): Promise<void> => {
    await instance.patch(`/notifications/${id}/read`);
  },

  // Eliminar notificación
  // DELETE /notifications/:id
  delete: async (id: number): Promise<void> => {
    await instance.delete(`/notifications/${id}`);
  },

  // --- Métodos Específicos para Driver (Usando la lógica de Roles) ---
  
  // Obtener notificaciones del conductor (Asumiendo que tienes el userId a mano)
  getDriverNotifications: async (driverId: number): Promise<Notification[]> => {
    return await NotificationService.getByUserId(driverId);
  },
  
  // Obtener no leídas para el conductor (Usando el rol DeliveryDriver)
  getUnreadDriverNotifications: async (driverId:number): Promise<Notification[]> => {
      // Opción A: Filtrar por rol si no tienes endpoint específico de "mis no leídas"
      const all = await NotificationService.getByUserId(driverId);
      return all.filter(n => !n.isRead);
  }
};

export default NotificationService;