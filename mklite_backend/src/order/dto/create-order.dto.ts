import { Order } from 'src/entity/order.entity';
import { IsOptional, IsNumber } from 'class-validator';

export class CreateOrderDto {
  user_id!: number;
  paymentMethod!: string;
  status?: Order['status'];

  items!: {
    productId: number;
    quantity: number;
  }[];

  @IsOptional()
  @IsNumber()
  deliveryAddressId?: number; // Opcional: si se proporciona, se crea el Shipment automáticamente
}
