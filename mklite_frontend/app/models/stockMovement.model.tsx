import ProductModel from "./productCard.model";
import Lot from "./lot.model";
import User from "./user.model";

export type StockMovementType =
  | "purchase_entry"
  | "sale_exit"
  | "expired_adjustment"
  | "return_adjustment";

export default interface StockMovement {
  id: number;
  quantity: number;
  type: StockMovementType;
  movementDate: string;

  product: ProductModel;
  lot?: Lot;
  user?: User;
}
