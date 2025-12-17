// src/shipment/shipment.service.ts

import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Shipment, ShipmentStatus } from '../entity/shipment.entity';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';

import { User } from '../entity/user.entity';
import { Order } from '../entity/order.entity';
import { Address } from '../entity/address.entity';

import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class ShipmentService {
  constructor(
    @InjectRepository(Shipment)
    private readonly shipmentRepository: Repository<Shipment>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,

    private readonly notificationService: NotificationService,
  ) {}

  // =====================================================
  // VALIDACIONES
  // =====================================================
  private async validateShipmentRelations(
    dto: CreateShipmentDto | UpdateShipmentDto,
  ) {
    if (dto.orderId) {
      const order = await this.orderRepository.findOneBy({
        id: dto.orderId,
      });
      if (!order) {
        throw new NotFoundException(
          `Order with ID ${dto.orderId} not found.`,
        );
      }
    }

    if (dto.deliveryAddressId) {
      const address = await this.addressRepository.findOneBy({
        id: dto.deliveryAddressId,
      });
      if (!address) {
        throw new NotFoundException(
          `Delivery Address with ID ${dto.deliveryAddressId} not found.`,
        );
      }
    }

    if (dto.deliveryDriverId) {
      const driver = await this.userRepository.findOneBy({
        id: dto.deliveryDriverId,
      });
      if (!driver) {
        throw new NotFoundException(
          `Delivery driver with ID ${dto.deliveryDriverId} not found.`,
        );
      }
    }
  }

  // =====================================================
  // CRUD BÁSICO
  // =====================================================
  async create(dto: CreateShipmentDto): Promise<Shipment> {
    await this.validateShipmentRelations(dto);

    const shipment = this.shipmentRepository.create({
      ...dto,
      order: { id: dto.orderId },
      deliveryAddress: { id: dto.deliveryAddressId },
      deliveryDriver: dto.deliveryDriverId
        ? { id: dto.deliveryDriverId }
        : null,
      estimatedDeliveryAt: dto.estimatedDeliveryAt
        ? new Date(dto.estimatedDeliveryAt)
        : null,
    });

    return this.shipmentRepository.save(shipment);
  }

  async findAll(): Promise<Shipment[]> {
    return this.shipmentRepository.find({
      relations: [
        'order',
        'order.user',
        'deliveryDriver',
        'deliveryAddress',
      ],
    });
  }

  async findOne(id: number): Promise<Shipment> {
    const shipment = await this.shipmentRepository.findOne({
      where: { id },
      relations: [
        'order',
        'order.user',
        'order.items',
        'order.items.product',
        'deliveryDriver',
        'deliveryAddress',
      ],
    });

    if (!shipment) {
      throw new NotFoundException(
        `Shipment with ID ${id} not found.`,
      );
    }

    return shipment;
  }

  async update(
    id: number,
    dto: UpdateShipmentDto,
  ): Promise<Shipment> {
    await this.findOne(id);
    await this.validateShipmentRelations(dto);

    const updateData: any = {
      ...dto,
      deliveryDriver: dto.deliveryDriverId
        ? { id: dto.deliveryDriverId }
        : undefined,
      deliveryAddress: dto.deliveryAddressId
        ? { id: dto.deliveryAddressId }
        : undefined,
    };

    await this.shipmentRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.shipmentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Shipment with ID ${id} not found.`,
      );
    }
  }

  // =====================================================
  // RIDER - PEDIDOS DISPONIBLES
  // =====================================================
  async findAvailable(): Promise<Shipment[]> {
    return this.shipmentRepository.find({
      where: {
        status: 'pending',
        deliveryDriver: null,
      },
      relations: [
        'order',
        'order.user',
        'order.items',
        'order.items.product',
        'deliveryAddress',
      ],
      order: {
  id: 'ASC',
},

    });
  }

  // =====================================================
  // RIDER - PEDIDOS ASIGNADOS
  // =====================================================
  async findByDriver(driverId: number): Promise<Shipment[]> {
    const driver = await this.userRepository.findOne({
      where: { id: driverId, role: 'DeliveryDriver' },
    });

    if (!driver) {
      throw new NotFoundException(
        `Driver with ID ${driverId} not found.`,
      );
    }

    return this.shipmentRepository.find({
      where: {
        deliveryDriver: { id: driverId },
      },
      relations: [
        'order',
        'order.user',
        'order.items',
        'order.items.product',
        'deliveryAddress',
      ],
      order: {
  id: 'ASC',
},

    });
  }

  // =====================================================
  // RIDER - HISTORIAL (ENTREGADOS)
  // =====================================================
  async getDriverDeliveryHistory(
    driverId: number,
    page = 1,
    limit = 10,
  ) {
    const driver = await this.userRepository.findOne({
      where: { id: driverId, role: 'DeliveryDriver' },
    });

    if (!driver) {
      throw new NotFoundException(
        `Driver with ID ${driverId} not found.`,
      );
    }

    const [shipments, total] =
      await this.shipmentRepository.findAndCount({
        where: {
          deliveryDriver: { id: driverId },
          status: 'delivered',
        },
        relations: [
          'order',
          'order.user',
          'order.items',
          'order.items.product',
          'deliveryAddress',
        ],
        order: {
          deliveredAt: 'DESC',
        },
        skip: (page - 1) * limit,
        take: limit,
      });

    return {
      total,
      page,
      limit,
      data: shipments,
    };
  }

  // =====================================================
  // ASIGNAR REPARTIDOR
  // =====================================================
  async assignDriverAndUpdateStatus(
    shipmentId: number,
    driverId: number,
    status?: ShipmentStatus,
  ): Promise<Shipment> {
    const shipment = await this.findOne(shipmentId);

    const driver = await this.userRepository.findOneBy({
      id: driverId,
    });

    if (!driver) {
      throw new NotFoundException(
        `Delivery driver with ID ${driverId} not found.`,
      );
    }

    shipment.deliveryDriver = driver;
    shipment.assignedAt = new Date();

    if (status) {
      shipment.status = status;
    } else if (shipment.status === 'pending') {
      shipment.status = 'processing';
    }

    if (shipment.order) {
      await this.orderRepository.update(shipment.order.id, {
        status: 'processing',
      });
    }

    const saved = await this.shipmentRepository.save(shipment);

    await this.notificationService.create({
      title: 'Nuevo Pedido Asignado',
      detail: `Has aceptado el envío #${saved.id}.`,
      type: 'ORDER_RECEIVED',
      recipientRole: 'DeliveryDriver',
      userId: driverId,
      relatedEntityId: saved.id.toString(),
    });

    return saved;
  }

  // =====================================================
  // ACTUALIZAR ESTADO (RETIRO / ENTREGA)
  // =====================================================
  async updateStatus(
    id: number,
    newStatus: ShipmentStatus,
  ): Promise<Shipment> {
    const shipment = await this.findOne(id);

    shipment.status = newStatus;

    if (newStatus === 'delivered' && !shipment.deliveredAt) {
      shipment.deliveredAt = new Date();
    }

    return this.shipmentRepository.save(shipment);
  }
}
