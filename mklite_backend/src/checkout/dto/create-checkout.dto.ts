// src/checkout/dto/create-checkout.dto.ts
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { PaymentMethod } from '../../entity/payment.entity'; // Importamos el tipo

export class CreateCheckoutDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  deliveryAddressId: number;

  @IsNotEmpty()
  @IsEnum(['cash', 'qr', 'card'])
  paymentMethod: PaymentMethod;
}