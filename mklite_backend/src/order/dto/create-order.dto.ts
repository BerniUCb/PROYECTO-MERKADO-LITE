import { Order } from 'src/entity/order.entity';

export class CreateOrderDto {
  user_id!: number;
  paymentMethod!: string;
  status?: Order['status'];

  items!: {
    productId: number;
    quantity: number;
  }[];
}
