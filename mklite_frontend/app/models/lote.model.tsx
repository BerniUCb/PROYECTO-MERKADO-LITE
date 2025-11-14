import ProductCardModel from "./productCard.model";
import Proveedor from "./proveedor.model";

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
