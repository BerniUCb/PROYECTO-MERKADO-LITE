import User from "./user.model";

export type NotificationType =
  | "CASH_REGISTER_CLOSED"
  | "LOW_STOCK"
  | "HIGH_DEMAND_PRODUCT"
  | "ORDER_RECEIVED"
  | "ORDER_SHIPPED"
  | "ORDER_DELIVERED"
  | "NEW_PROMOTION";

// 🔥 CORREGIDO: Agregar DeliveryDriver para consistencia con backend
export type RecipientRole = "Admin" | "Client" | "DeliveryDriver";

export default interface Notification {
  id: number;
  title: string;
  detail: string;
  type: NotificationType;
  recipientRole: RecipientRole;
  relatedEntityId?: string;
  isRead: boolean;
  createdAt: string;

  user?: User;
}