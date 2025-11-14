import Pedido from "./pedido.model";
import User from "./user.model";
import type  {MensajeSoporte}from "./mensajeSoporte.model";

export type EstadoTicket =
  | 'abierto'
  | 'en_proceso'
  | 'resuelto'
  | 'cerrado';

export interface TicketSoporte {
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
