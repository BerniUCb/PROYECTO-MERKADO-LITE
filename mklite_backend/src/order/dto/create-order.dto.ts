import { Order } from 'src/entity/order.entity';
export class CreateOrderDto {
  orderTotal!: number;
  paymentMethod!: string;
  user_id!: number;
  status?: Order['status'];
  items!: { productId: number; quantity: number; price: number; }[];
}
