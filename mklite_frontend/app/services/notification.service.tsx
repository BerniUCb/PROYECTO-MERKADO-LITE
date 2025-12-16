// src/app/services/notification.service.tsx
import Notification, { NotificationType } from "../models/notification.model";
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/notifications`;

class NotificationService {
  // ⭐ Obtener todas las notificaciones del CLIENTE
  async getClientNotifications(): Promise<Notification[]> {
    const res = await fetch(`${API_URL}/all-by-role?role=Client`, {
      method: "GET",
      cache: "no-cache",
    });

    if (!res.ok) throw new Error("Error al obtener notificaciones del cliente");
    return res.json();
  }

  // ⭐ Obtener notificaciones NO leídas del CLIENTE
  async getUnreadClientNotifications(): Promise<Notification[]> {
    const res = await fetch(`${API_URL}/unread-by-role?role=Client`, {
      method: "GET",
      cache: "no-cache",
    });

    if (!res.ok)
      throw new Error("Error al obtener notificaciones no leídas del cliente");

    return res.json();
  }

  // ⭐ Obtener todas las notificaciones del ADMIN
  async getAdminNotifications(): Promise<Notification[]> {
    const res = await fetch(`${API_URL}/all-by-role?role=Admin`, {
      method: "GET",
      cache: "no-cache",
    });

    if (!res.ok) throw new Error("Error al obtener notificaciones del admin");
    return res.json();
  }

  // ⭐ Obtener solo no leídas del ADMIN
  async getUnreadAdminNotifications(): Promise<Notification[]> {
    const res = await fetch(`${API_URL}/unread-by-role?role=Admin`, {
      method: "GET",
      cache: "no-cache",
    });

    if (!res.ok)
      throw new Error("Error al obtener notificaciones no leídas del admin");

    return res.json();
  }
  // ⭐ Obtener todas las notificaciones del REPARTIDOR
async getDriverNotifications(): Promise<Notification[]> {
  const res = await fetch(`${API_URL}/all-by-role?role=DeliveryDriver`, {
    method: "GET",
    cache: "no-cache",
  });

  if (!res.ok)
    throw new Error("Error al obtener notificaciones del repartidor");

  return res.json();
}

// ⭐ Obtener no leídas del REPARTIDOR
async getUnreadDriverNotifications(): Promise<Notification[]> {
  const res = await fetch(`${API_URL}/unread-by-role?role=DeliveryDriver`, {
    method: "GET",
    cache: "no-cache",
  });

  if (!res.ok)
    throw new Error("Error al obtener notificaciones no leídas del repartidor");

  return res.json();
}


  // ⭐ Obtener por TIPO (order, promos, inventario, etc.)
  async getByType(type: NotificationType): Promise<Notification[]> {
    const res = await fetch(`${API_URL}/by-type?type=${type}`, {
      method: "GET",
      cache: "no-cache",
    });

    if (!res.ok) throw new Error("Error al obtener notificaciones por tipo");
    return res.json();
  }

  // ⭐ Marcar como leída
  async markAsRead(id: number): Promise<Notification> {
    const res = await fetch(`${API_URL}/${id}/read`, {
      method: "PATCH",
    });

    if (!res.ok) throw new Error("Error al marcar como leída");
    return res.json();
  }

  // ⭐ Eliminar notificación
  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Error al eliminar notificación");
  }
}

const notificationService = new NotificationService();
export default notificationService;
