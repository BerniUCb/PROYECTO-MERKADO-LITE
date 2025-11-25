import Order from "./order.model";
import User from "./user.model";
import SupportMessage from "./supportMessage.model";

export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";

export default interface SupportTicket {
  id: number;
  subject: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;

  order: Order;
  client: User;
  agent?: User;

  messages: SupportMessage[];
}
