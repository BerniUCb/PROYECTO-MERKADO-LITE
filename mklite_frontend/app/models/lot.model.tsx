import ProductCardModel from "./productCard.model";
import Proveedor from "./ provider.model";

export default interface Lote {
  id: number;
  cantidadRecibida: number;
  cantidadActual: number;
  costoDistribuidor?: number;
  fechaRecibida: string;
  fechaVencimiento?: string;

  producto: ProductCardModel;
  proveedor?: Proveedor;
}
