import ProductModel from "./productCard.model";
import SupplierModel from "./supplier.model";
import LotModel from "./lot.model";

export type ReturnReason = 'expired' | 'defective' | 'damaged_shipping';
export type ReturnStatus = 'pending' | 'approved' | 'rejected' | 'refunded';

export default interface SupplierReturnModel {
  id: number;
  quantity: number;
  reason: ReturnReason;
  status: ReturnStatus;
  notes?: string;
  createdAt: Date;
  resolvedAt?: Date;

  product: ProductModel;
  supplier: SupplierModel;
  lot?: LotModel; // opcional igual que en la entidad
}
