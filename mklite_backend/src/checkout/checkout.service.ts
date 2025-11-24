// src/checkout/checkout.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCheckoutDto } from './dto/create-checkout.dto';

// --- Importamos todas las entidades que vamos a manipular ---
import { User } from '../entity/user.entity';
import { Address } from '../entity/address.entity';
import { CartItem } from '../entity/cart-item.entity';
import { Product } from '../entity/product.entity';
import { Order } from '../entity/order.entity';
import { OrderItem } from '../entity/order-item.entity';
import { StockMovement } from '../entity/stock-movement.entity';
import { Payment } from '../entity/payment.entity';
import { Shipment } from '../entity/shipment.entity';

@Injectable()
export class CheckoutService {
  constructor(
    // Inyectamos el DataSource para poder manejar la transacción manualmente
    private readonly dataSource: DataSource,
    // Inyectamos repositorios solo para validaciones rápidas si es necesario antes de la transacción
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Address) private readonly addressRepo: Repository<Address>,
    @InjectRepository(CartItem) private readonly cartItemRepo: Repository<CartItem>,
  ) {}

  async processCheckout(createCheckoutDto: CreateCheckoutDto) {
    const { userId, deliveryAddressId, paymentMethod } = createCheckoutDto;

    // --- Validaciones previas (fuera de la transacción para fallar rápido) ---
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    const address = await this.addressRepo.findOne({ where: { id: deliveryAddressId, user: { id: userId } } });
    if (!address) throw new NotFoundException(`Address with ID ${deliveryAddressId} for this user not found`);

    const cartItems = await this.cartItemRepo.find({
      where: { user: { id: userId } },
      relations: ['product'],
    });
    if (cartItems.length === 0) {
      throw new BadRequestException('Cannot create an order with an empty cart');
    }

    // --- Inicio de la Transacción ---
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Crear la Orden
      const order = queryRunner.manager.create(Order, { user, status: 'pending', paymentMethod, orderTotal: 0 });
      let orderTotal = 0;

      // 2. Procesar cada item del carrito
      for (const item of cartItems) {
        const product = await queryRunner.manager.findOne(Product, { where: { id: item.product.id } });
        if (!product || product.physicalStock < item.quantity) {
          throw new BadRequestException(`Not enough stock for product "${item.product.name}"`);
        }

        // Crear el OrderItem
        const orderItem = queryRunner.manager.create(OrderItem, {
          product,
          quantity: item.quantity,
          unitPrice: product.salePrice,
          order,
        });
        await queryRunner.manager.save(orderItem);

        // Actualizar stock
        product.physicalStock -= item.quantity;
        await queryRunner.manager.save(product);

        // Registrar movimiento de stock
        const stockMovement = queryRunner.manager.create(StockMovement, {
          product,
          quantity: -item.quantity,
          type: 'sale_exit',
          user,
        });
        await queryRunner.manager.save(stockMovement);

        orderTotal += item.quantity * product.salePrice;
      }

      // 3. Actualizar el total de la orden y guardarla
      order.orderTotal = orderTotal;
      const savedOrder = await queryRunner.manager.save(order);

      // 4. Crear el Pago asociado
      const payment = queryRunner.manager.create(Payment, { order: savedOrder, amount: orderTotal, method: paymentMethod, status: 'pending' });
      await queryRunner.manager.save(payment);

      // 5. Crear el Envío asociado
      const shipment = queryRunner.manager.create(Shipment, { order: savedOrder, deliveryAddress: address, status: 'pending' });
      await queryRunner.manager.save(shipment);

      // 6. Vaciar el carrito
      await queryRunner.manager.remove(CartItem, cartItems);

      // 7. Si todo fue exitoso, confirma la transacción
      await queryRunner.commitTransaction();

      // Devolvemos la orden completa con sus relaciones
      return queryRunner.manager.findOne(Order, {
          where: { id: savedOrder.id },
          relations: ['items', 'items.product', 'payment', 'shipment', 'shipment.deliveryAddress']
      });

    } catch (error) {
      // Si algo falla, revierte todos los cambios
      await queryRunner.rollbackTransaction();
      throw error; // Re-lanza el error para que NestJS lo capture
    } finally {
      // Libera el queryRunner en cualquier caso
      await queryRunner.release();
    }
  }
}