import CategoryModel from "./categoryCard.model";
import OrderItem from "./orderItem.model";
import priceHistory from "./priceHistory.model";

export default interface ProductModel {
  id: number;
  name: string;
  description?: string | null;  // nullable en la entidad
  salePrice: number;
  unitOfMeasure: string;
  physicalStock: number;
  reservedStock: number;
  imageUrl?: string | null; // también nullable en la entidad
  isActive: boolean;

  // Relaciones
  category: CategoryModel;

  // Si tu frontend va a usarlo:
  orderItems?: OrderItem[];
  priceHistory?: priceHistory[];
}
