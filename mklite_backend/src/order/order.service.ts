import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from 'src/entity/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderItem } from 'src/entity/order-item.entity';
import { QueryHelpers } from 'src/utils/query-helpers';
import { Product } from 'src/entity/product.entity';
import { Shipment } from 'src/entity/shipment.entity';
import { Address } from 'src/entity/address.entity';
import { Payment } from 'src/entity/payment.entity';


@Injectable()
export class OrderService {
    constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Shipment)
    private readonly shipmentRepository: Repository<Shipment>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    private readonly dataSource: DataSource,
  ) {}

 async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const items = await Promise.all(
      createOrderDto.items.map(async (item) => {
        const product = await this.productRepository.findOne({ where: { id: item.productId } });
        
        if (!product) {
          throw new NotFoundException(`Producto con ID ${item.productId} no encontrado`);
        }

        // --- VALIDACIÓN DE STOCK ---
        if (product.physicalStock < item.quantity) {
             throw new BadRequestException(`No hay suficiente stock para ${product.name}. Disponible: ${product.physicalStock}`);
        }

        // --- ACTUALIZACIÓN DE STOCK (ESTO FALTABA) ---
        product.physicalStock -= item.quantity; // 1. Restamos la cantidad
        await this.productRepository.save(product); // 2. Guardamos el cambio en la BD <--- CRUCIAL

        const orderItem = new OrderItem();
        orderItem.product = product;
        orderItem.quantity = item.quantity;
        orderItem.unitPrice = product.salePrice;
        return orderItem;
      }),
    );

    // calcular total
    const total = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

    // crear order
    const order = this.orderRepository.create({
      paymentMethod: createOrderDto.paymentMethod,
      user: { id: createOrderDto.user_id } as any,
      status: createOrderDto.status || 'pending',
      items,
      orderTotal: total,
    });

    const savedOrder = await this.orderRepository.save(order);

    // ✅ Crear Payment automáticamente
    const payment = this.paymentRepository.create({
      order: savedOrder,
      amount: total,
      method: createOrderDto.paymentMethod,
      status: 'pending',
    });
    await this.paymentRepository.save(payment);

    // ✅ Crear Shipment automáticamente si se proporciona deliveryAddressId
    if (createOrderDto.deliveryAddressId) {
      const address = await this.addressRepository.findOne({
        where: { id: createOrderDto.deliveryAddressId },
        relations: ['user'],
      });

      if (!address) {
        throw new NotFoundException(
          `Address with ID ${createOrderDto.deliveryAddressId} not found`,
        );
      }

      // Verificar que la dirección pertenece al usuario
      if (address.user.id !== createOrderDto.user_id) {
        throw new BadRequestException(
          `Address ${createOrderDto.deliveryAddressId} does not belong to user ${createOrderDto.user_id}`,
        );
      }

      const shipment = this.shipmentRepository.create({
        order: savedOrder,
        deliveryAddress: address,
        status: 'pending',
      });
      await this.shipmentRepository.save(shipment);
    }

    return savedOrder;
  }

  async findAll(
  page?: number,
  limit?: number,
  sort?: string,
  order?: 'asc' | 'desc',
): Promise<Order[]> {
  const { page: p, limit: l } = QueryHelpers.normalizePage(page, limit);

  const orders = await this.orderRepository.find({
    relations: {
      user: true,
      payment: true,
      items: {
        product: true,   // 🔥 También aquí
      },
    },
    skip: (p - 1) * l,
    take: l,
  });

  return QueryHelpers.orderByProp(orders, sort, order);
}



 async findOne(id: number): Promise<Order> {
  const order = await this.orderRepository.findOne({
    where: { id },
    relations: {
      user:{
        addresses: true,
      },
      payment: true,
      items: {
        product: true,  // 🔥 Cargar producto dentro de cada item
      },
    },
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
  const total = await this.orderRepository.count();
  return total;
}

// TOTAL de órdenes canceladas
async getCancelledOrdersCount(): Promise<number> {
  const cancelled = await this.orderRepository.count({
    where: { status: 'cancelled' },
  });
  return cancelled;
}

async getByUser(
  userId: number,
  page: number = 1,
  limit: number = 10,
) {
  const skip = (page - 1) * limit;

  const [orders, total] = await this.orderRepository.findAndCount({
    where: { user: { id: userId } },
    relations: {
      user: true,
      payment: true,
      items: {
        product: true,
      },
    },
    take: limit,
    skip,
    order: { createdAt: 'DESC' },
  });

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    data: orders,
  };
}

}



