import SupportTicket from "./supportTicket.model";
import User from "./user.model";

export default interface SupportMessage {
  id: number;
  content: string;
  sentAt: string;

  ticket: SupportTicket;
  sender: User;
}
