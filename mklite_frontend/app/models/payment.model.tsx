import Order from "./order.model";

export type PaymentMethod = "cash" | "qr" | "card";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export default interface Payment {
  id: number;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  receiptNumber?: string;
  receiptUrl?: string;
  paidAt: string;

  order: Order;
}
