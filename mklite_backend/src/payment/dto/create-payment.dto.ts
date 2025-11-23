
import { PaymentMethod, PaymentStatus } from 'src/entity/payment.entity';

export class CreatePaymentDto {
  
  amount!: number;
  method!: PaymentMethod;
  status?: PaymentStatus;
  receiptNumber?: string;
  receiptUrl?: string;
  order_id!: number;
}
