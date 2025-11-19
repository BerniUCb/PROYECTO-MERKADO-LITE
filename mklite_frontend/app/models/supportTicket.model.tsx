import Pedido from "./order.model";
import User from "./user.model";
import MensajeSoporte from "./supportMessage.model";

export type EstadoTicket =
  | 'abierto'
  | 'en_proceso'
  | 'resuelto'
  | 'cerrado';

export default interface TicketSoporte {
  id: number;
  asunto: string;
  estado: EstadoTicket;
  fechaCreacion: string;
  fechaActualizacion: string;

  pedido: Pedido;
  cliente: User;
  agente?: User;

  mensajes: MensajeSoporte[];
}
