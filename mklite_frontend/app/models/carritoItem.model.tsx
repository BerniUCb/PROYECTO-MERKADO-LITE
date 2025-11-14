import ProductCardModel from "./productCard.model";
import User from "./user.model";

export default interface CarritoItem {
  id: number;
  cantidad: number;
  precioUnitario: number;
  fechaAgregado: string;

  cliente: User;
  producto: ProductCardModel;
}
