import Order from "./order.model";
import User from "./user.model";
import SupportMessage from "./supportMessage.model";

export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "urgent"; // Agregamos esto si lo usas visualmente

export default interface SupportTicket {
  id: number;
  subject: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  
  // Agregamos priority si la vas a usar en el front (aunque el back no la tenga aun, puede ser opcional)
  priority?: TicketPriority; 

  order: Order;
  
  // CAMBIO IMPORTANTE: Renombramos 'client' a 'user' para coincidir con el Backend
  user: User; 
  
  agent?: User;
  messages: SupportMessage[];
}