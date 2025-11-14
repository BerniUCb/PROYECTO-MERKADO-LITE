import ProductCardModel from "./productCard.model";
import User from "./user.model";

export default interface HistorialPrecio {
  id: number;
  precioNuevo: number;
  fechaCambio: string;

  producto: ProductCardModel;
  usuarioModifico: User;
}
