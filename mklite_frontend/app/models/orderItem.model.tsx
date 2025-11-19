import ProductModel from "./productCard.model";

export default interface OrderItem {
  id: number;
  quantity: number;
  unitPrice: number;

  product: ProductModel;
}
