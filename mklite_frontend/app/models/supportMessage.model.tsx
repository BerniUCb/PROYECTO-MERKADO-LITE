import TicketSoporte from "./supportTicket.model";
import User from "./user.model";

export default interface MensajeSoporte {
  id: number;
  contenido: string;
  fechaEnvio: string;

  ticket: TicketSoporte;
  remitente: User;
}
