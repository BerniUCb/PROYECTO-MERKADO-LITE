import ProductCardModel from "./productCard.model";


export default interface Promocion {
  id: number;
  descripcion: string;
  tipoDescuento?: string;
  valorDescuento?: number;
  fechaInicio?: string;
  fechaFin?: string;

  producto?: ProductCardModel;
}
