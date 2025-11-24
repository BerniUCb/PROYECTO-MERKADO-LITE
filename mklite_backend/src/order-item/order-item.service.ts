
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from '../entity/order-item.entity';

@Injectable()
export class OrderItemService {
  
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async createOrderItem(orderItem: OrderItem): Promise<OrderItem> {
    
    const newOrderItem = this.orderItemRepository.create(orderItem); 
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

  async updateOrderItem(id: number, orderItemUpdateData: Partial<OrderItem>): Promise<OrderItem> {
    
    
    const orderItemToUpdate = await this.orderItemRepository.preload({
      id: id,
      ...orderItemUpdateData,
    });

    if (!orderItemToUpdate) {
      throw new NotFoundException(`Order item with ID "${id}" not found`);
    }


    return await this.orderItemRepository.save(orderItemToUpdate);
  }
}
