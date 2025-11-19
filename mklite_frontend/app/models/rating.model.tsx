import Order from "./order.model";
import User from "./user.model";

export default interface Rating {
  id: number;
  score: number;
  comment?: string;
  createdAt: string;

  order: Order;
  user: User;
}
