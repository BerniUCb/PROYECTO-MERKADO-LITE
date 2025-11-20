import ProductCardModel from "./productCard.model";
import User from "./user.model";

export default interface PriceHistory {
  id: number;
  newPrice: number;
  changedAt: string;

  product: ProductCardModel;
  changedByUser: User;
}
