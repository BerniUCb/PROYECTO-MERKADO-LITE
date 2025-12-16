export interface CreateOrderDto {
  user_id: number;
  paymentMethod: string;
  status?: string;
  items: {
    productId: number;
    quantity: number;
  }[];
}
