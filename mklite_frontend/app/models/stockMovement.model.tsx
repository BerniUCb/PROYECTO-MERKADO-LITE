import ProductCardModel from "./productCard.model";
import Lote from "./lot.model";
import User from "./user.model";

export type TipoMovimiento =
  | 'entrada_compra'
  | 'salida_venta'
  | 'ajuste_vencido'
  | 'ajuste_devolucion';

export default interface MovimientoStock {
  id: number;
  cantidad: number;
  tipo: TipoMovimiento;
  fechaMovimiento: string;

  producto: ProductCardModel;
  lote?: Lote;
  usuario?: User;
}
