import Pedido from "./pedido.model";
import User from "./user.model";


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

  pedido: Pedido;
  repartidor?: User;
}
