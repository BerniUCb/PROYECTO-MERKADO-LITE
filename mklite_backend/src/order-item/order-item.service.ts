
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetallePedido } from '../entity/order-item.entity';

@Injectable()
export class OrderItemService {
  
  constructor(
    @InjectRepository(DetallePedido)
    private readonly orderItemRepository: Repository<DetallePedido>,
  ) {}

  async createOrderItem(orderItem: DetallePedido): Promise<DetallePedido> {
    
    const newOrderItem = this.orderItemRepository.create(orderItem); 
    return await this.orderItemRepository.save(newOrderItem);
  }

  async getAllOrderItems(): Promise<DetallePedido[]> {
    
    return await this.orderItemRepository.find();
  }

  async getOrderItemById(id: number): Promise<DetallePedido> {
    const orderItem = await this.orderItemRepository.findOneBy({ id });

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

  async updateOrderItem(id: number, orderItemUpdateData: Partial<DetallePedido>): Promise<DetallePedido> {
    
    
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
