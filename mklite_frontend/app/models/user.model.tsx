import AddressModel from "./address.model";

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
  role: UserRole;
  isActive: boolean;

  addresses: AddressModel[];
}
