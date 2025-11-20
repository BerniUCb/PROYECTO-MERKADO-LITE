import ProductModel from "./productCard.model";
import User from "./user.model";

export default interface PriceHistory {
  id: number;
  newPrice: number;
  changedAt: string;

  product: ProductModel;
  changedByUser: User;
}
