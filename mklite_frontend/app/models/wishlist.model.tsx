import ProductModel from "./productCard.model";
import User from "./user.model";

export default interface WishlistItem {
  id: number;
  addedAt: string;
  user: User;
  product: ProductModel;
}