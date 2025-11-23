import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from 'src/entity/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Order } from 'src/entity/order.entity';

@Injectable()
export class PaymentService {

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  
  async createPayment(dto: CreatePaymentDto): Promise<Payment> {
    const order = await this.orderRepository.findOneBy({ id: dto.order_id });

    if (!order) {
      throw new NotFoundException(`Order with ID ${dto.order_id} not found`);
    }

    const payment = this.paymentRepository.create({
      amount: dto.amount,
      method: dto.method,
      status: dto.status ?? 'pending',
      receiptNumber: dto.receiptNumber ?? null,
      receiptUrl: dto.receiptUrl ?? null,
      order,
    });

    return this.paymentRepository.save(payment);
  }

  async getAllPayments(): Promise<Payment[]> {
    return this.paymentRepository.find({
      relations: ['order'],
    });
  }

  async getPaymentById(id: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['order'],
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return payment;
  }

  async updatePayment(id: number, dto: UpdatePaymentDto): Promise<Payment> {
    const payment = await this.paymentRepository.preload({
      id,
      amount: dto.amount,
      method: dto.method,
      status: dto.status,
      receiptNumber: dto.receiptNumber,
      receiptUrl: dto.receiptUrl,
      order: dto.order_id ? { id: dto.order_id } : undefined,
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return this.paymentRepository.save(payment);
  }

  async deletePayment(id: number): Promise<{ deleted: boolean }> {
    const result = await this.paymentRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return { deleted: true };
  }
}
