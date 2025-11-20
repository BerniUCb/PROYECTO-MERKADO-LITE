import ProductModel from "./productCard.model";
import Supplier from "./supplier.model";
import StockMovement from "./stockMovement.model";

export default interface Lot {
  id: number;
  receivedQuantity: number;
  currentQuantity: number;
  supplierCost?: number;
  receivedAt: string;
  expiresAt?: string;

  product: ProductModel;
  supplier?: Supplier;
  stockMovements: StockMovement[];
}
