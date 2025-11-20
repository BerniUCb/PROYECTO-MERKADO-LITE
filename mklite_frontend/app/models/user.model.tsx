import AddressModel from "./address.model";
import Order from "./order.model";
import  Shipment  from "./shipment.model";
import  CartItem  from "./carItem.model";
import  Rating  from "./rating.model";
import  StockMovement  from "./stockMovement.model";
import  Address  from "./address.model";
import  Notification  from "./notification.model";

export type UserRole =
  | "Administrator"
  | "Sales"
  | "Warehouse"
  | "Delivery"
  | "Client"
  | "Support"
  | "Supplier";

export default interface User {
  id: number;
  fullName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;

  isTwoFactorEnabled: boolean;
  twoFactorSecret: string;
  orders: Order[];
  assignedShipments: Shipment[];
  cartItems: CartItem[];
  ratings: Rating[];
  stockMovements: StockMovement[];
  notifications: Notification[];
  addresses: AddressModel[];
}
