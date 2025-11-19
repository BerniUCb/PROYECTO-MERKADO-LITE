import User from "./user.model";
import OrderItem from "./orderItem.model";

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "returned"
  | "cancelled";

export default interface Order {
  id: number;
  createdAt: string;
  status: OrderStatus;
  orderTotal: number;
  paymentMethod: string;

  user: User;
  items: OrderItem[];
}
