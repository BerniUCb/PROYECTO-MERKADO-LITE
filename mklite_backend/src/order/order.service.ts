import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from 'src/entity/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderItem } from 'src/entity/order-item.entity';
import { QueryHelpers } from 'src/utils/query-helpers';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.orderRepository.create({
      orderTotal: createOrderDto.orderTotal,
      paymentMethod: createOrderDto.paymentMethod,
      user: { id: createOrderDto.user_id },
      status: createOrderDto.status || 'pending',
      items: createOrderDto.items.map(item => {
        const orderItem = new OrderItem();
        orderItem.product = { id: item.productId } as any;
        orderItem.quantity = item.quantity;
        orderItem.unitPrice = item.price;
        return orderItem;
      }),
    });
    return await this.orderRepository.save(order);
  }

  async findAll(
  page?: number,
  limit?: number,
  sort?: string,
  order?: 'asc' | 'desc',
): Promise<Order[]> {
  const { page: p, limit: l } = QueryHelpers.normalizePage(page, limit);

  const orders = await this.orderRepository.find({
    relations: ['user', 'items', 'payment'],
    skip: (p - 1) * l,
    take: l,
  });

  return QueryHelpers.orderByProp(orders, sort, order);
}


  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'items', 'payment'],
    });

    if (!order) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    Object.assign(order, updateOrderDto);
    return await this.orderRepository.save(order);
  }

  async remove(id: number): Promise<void> {
    const result = await this.orderRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }
  }

  //Reportes
  //Total ventas
  async getTotalSales(){
    const result = await this.orderRepository
    .createQueryBuilder('order')
    .select('SUM(order.orderTotal)', 'total')
    .getRawOne();
    return {totalSales: Number(result.total) || 0};
  }
  //Pedidos pendientes
  async getPendingOrderCount(){
    const count = await this.orderRepository.count({
      where: { status: 'pending'},
    })
    return {pending: count}
  }
  //Ventas de los últimos 7 días
  async getWeeklySales(){
    return await this.orderRepository
    .createQueryBuilder('order')
    .select("TO_CHAR(order.createdAt, 'YYYY-MM-DD')", 'date')
    .addSelect('SUM(order.orderTotal)', 'total')
    .where("order.createdAt >= NOW() - INTERVAL '7 days'")
    .groupBy("TO_CHAR(order.createdAt, 'YYYY-MM-DD')")
    .orderBy('date', 'ASC')
    .getRawMany(
    )
  }
  //Último pedidos
  async getLatestOrders(){
    return await this.orderRepository.find({
      take: 10,
      order:{ createdAt: 'DESC' },
      relations: ['user', 'items', 'payment'],
    })
  }
  //Pedidos de los ultimos 7 dias
  async getLast7DaysSales(): Promise<number[]> {
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const orders = await this.orderRepository
    .createQueryBuilder('order')
    .where('order.createdAt BETWEEN :start AND :end', {
      start: sevenDaysAgo,
      end: today,
    })
    .select(['order.orderTotal', 'order.createdAt'])
    .getMany();

  // Generar array de 7 días inicializado en 0
  const salesByDay = Array(7).fill(0);

  for (const order of orders) {
    const orderDate = new Date(order.createdAt);
    const diff = Math.floor(
      (orderDate.getTime() - sevenDaysAgo.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diff >= 0 && diff < 7) {
      salesByDay[diff] += Number(order.orderTotal);
    }
  }

  return salesByDay;
}
// TOTAL de órdenes
  async getTotalOrdersCount(): Promise<number> {
    return await this.orderRepository.count();
  }

  // TOTAL de órdenes canceladas
  async getCancelledOrdersCount(): Promise<number> {
    return await this.orderRepository.count({
      where: { status: 'cancelled' },
    });
  }
}
