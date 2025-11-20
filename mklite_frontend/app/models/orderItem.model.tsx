import ProductModel from "./productCard.model";
import Order from "./order.model";

export default interface OrderItem {
  id: number;
  quantity: number;
  unitPrice: number;
  order: Order;
  product: ProductModel;
}
