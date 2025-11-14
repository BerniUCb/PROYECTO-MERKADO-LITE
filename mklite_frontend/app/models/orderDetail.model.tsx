import ProductCardModel from "./productCard.model";

export default interface DetallePedido {
  id: number;
  cantidad: number;
  precioUnitario: number;

  producto: ProductCardModel;
}
