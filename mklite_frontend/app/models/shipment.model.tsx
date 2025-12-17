// src/models/shipment.model.ts
import Order from "./order.model";
import User from "./user.model";
import AddressModel from "./address.model";

export type ShipmentStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "returned"
  | "cancelled";

export default interface Shipment {
  id: number;
  status: ShipmentStatus;

  assignedAt?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;

  order: Order;
  deliveryAddress: AddressModel;
  deliveryDriver?: User;
}
