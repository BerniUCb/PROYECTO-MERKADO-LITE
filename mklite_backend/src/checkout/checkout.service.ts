import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCheckoutDto } from './dto/create-checkout.dto';

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
    private readonly dataSource: DataSource,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,

    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,
  ) {}

  async processCheckout(createCheckoutDto: CreateCheckoutDto) {
    const { userId, deliveryAddressId, paymentMethod } = createCheckoutDto;

    // ---------------- VALIDACIONES ----------------

    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const address = await this.addressRepo.findOne({
      where: { id: deliveryAddressId, user: { id: userId } },
    });
    if (!address) {
      throw new NotFoundException(
        `Address with ID ${deliveryAddressId} for this user not found`,
      );
    }

    const cartItems = await this.cartItemRepo.find({
      where: { user: { id: userId } },
      relations: ['product'],
    });

    if (cartItems.length === 0) {
      throw new BadRequestException('Cannot create an order with an empty cart');
    }

    // ---------------- TRANSACCIÓN ----------------

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1) Crear y guardar Order
      const order = queryRunner.manager.create(Order, {
        user,
        status: 'pending',
        paymentMethod,
        orderTotal: 0,
      });

      const savedOrder = await queryRunner.manager.save(order);

      let orderTotal = 0;

      // 2) Crear OrderItems + stock
      for (const item of cartItems) {
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: item.product.id },
        });

        if (!product || product.physicalStock < item.quantity) {
          throw new BadRequestException(
            `Not enough stock for product "${item.product.name}"`,
          );
        }

        const orderItem = queryRunner.manager.create(OrderItem, {
          product,
          quantity: item.quantity,
          unitPrice: product.salePrice,
          order: savedOrder,
        });
        await queryRunner.manager.save(orderItem);

        product.physicalStock -= item.quantity;
        await queryRunner.manager.save(product);

        const stockMovement = queryRunner.manager.create(StockMovement, {
          product,
          quantity: -item.quantity,
          type: 'sale_exit',
          user,
               });
        await queryRunner.manager.save(stockMovement);

        orderTotal += item.quantity * product.salePrice;
      }

      // 3) Actualizar total
      savedOrder.orderTotal = orderTotal;
      await queryRunner.manager.save(savedOrder);

      // 4) Crear Payment
      const payment = queryRunner.manager.create(Payment, {
        order: savedOrder,
        amount: orderTotal,
        method: paymentMethod,
        status: 'pending',
      });
      await queryRunner.manager.save(payment);

      // 5) Crear Shipment (disponible para rider)
      const shipment = queryRunner.manager.create(Shipment, {
        order: savedOrder,
        deliveryAddress: address,
        status: 'pending',
      });
      await queryRunner.manager.save(shipment);

      // 6) Vaciar carrito
      await queryRunner.manager.remove(CartItem, cartItems);

      await queryRunner.commitTransaction();

      // 7) RESPUESTA FINAL (segura)
      return {
        order: savedOrder,
        payment,
        shipment,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
