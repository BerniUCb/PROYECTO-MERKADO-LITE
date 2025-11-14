import User from "./user.model";
import DetallePedido from "./detallePedido.model";

export type EstadoPedido =
  | 'pendiente'
  | 'procesando'
  | 'en camino'
  | 'entregado'
  | 'devuelto'
  | 'cancelado';

export default interface Pedido {
  id: number;
  fechaPedido: string;
  estado: EstadoPedido;
  totalPedido: number;
  metodoPago: string;

  cliente: User;
  detalles: DetallePedido[];
}
