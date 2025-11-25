
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from '../entity/order-item.entity';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';

@Injectable()
export class OrderItemService {
  
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async createOrderItem(dto: CreateOrderItemDto): Promise<OrderItem> {
  const newOrderItem = this.orderItemRepository.create({
    quantity: dto.quantity,
    unitPrice: dto.unitPrice,
    product: { id: dto.productId },
    order: { id: dto.orderId },
  });

  return await this.orderItemRepository.save(newOrderItem);
}
  

  async getAllOrderItems(): Promise<OrderItem[]> {
    
    return await this.orderItemRepository.find({relations: ['product', 'order'],});
  }

  async getOrderItemById(id: number): Promise<OrderItem> {
    const orderItem = await this.orderItemRepository.findOne({ where: { id }, relations: ['product', 'order'], });
    if (!orderItem) {
      throw new NotFoundException(`Order item with ID "${id}" not found`);
    }
    return orderItem;
  }

  async deleteOrderItem(id: number): Promise<{ deleted: boolean; affected?: number }> {
    const result = await this.orderItemRepository.delete({ id }); 

    if (result.affected === 0) {
      throw new NotFoundException(`Order item with ID "${id}" not found`);
    }
    return { deleted: true, affected: result.affected ?? 0 };
  }

  async updateOrderItem(id: number, dto: UpdateOrderItemDto): Promise<OrderItem> {
  const orderItem = await this.orderItemRepository.preload({
    id,
    quantity: dto.quantity,
    unitPrice: dto.unitPrice,
    product: dto.productId ? { id: dto.productId } : undefined,
    order: dto.orderId ? { id: dto.orderId } : undefined,
  });

  if (!orderItem) {
    throw new NotFoundException(`Order item with ID "${id}" not found`);
  }

  return await this.orderItemRepository.save(orderItem);
}

}
