import Pedido from "./order.model";
import User from "./user.model";
import DireccionModel from "./address.model";

export type EstadoEnvio =
  | 'pendiente'
  | 'procesando'
  | 'en camino'
  | 'entregado'
  | 'devuelto'
  | 'cancelado';

export default interface Envio {
  id: number;
  estado: EstadoEnvio;
  fechaAsignacion?: string;
  fechaEntregaEstimada?: string;
  fechaEntregado?: string;
  direccion: DireccionModel;
  direccionId: number;
  
  pedido: Pedido;
  repartidor?: User;
}
