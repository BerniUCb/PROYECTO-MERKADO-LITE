import type {TicketSoporte} from "./ticketSoporte.model";
import User from "./user.model";

export interface MensajeSoporte {
  id: number;
  contenido: string;
  fechaEnvio: string;

  ticket: TicketSoporte;
  remitente: User;
}
