import ProductModel from "./productCard.model";
import User from "./user.model";

export default interface CartItem {
  id: number;
  quantity: number;
  unitPrice: number;
  addedAt: string;

  user: User;
  product: ProductModel;
}
