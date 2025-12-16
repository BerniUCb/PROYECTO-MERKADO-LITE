import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Shipment, ShipmentStatus } from '../entity/shipment.entity';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { AssignShipmentDto } from './dto/assign-shipment.dto';

import { User } from '../entity/user.entity';
import { Order } from '../entity/order.entity';
import { Address } from '../entity/address.entity';

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
  ) {}

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private async validateShipmentRelations(
    dto: CreateShipmentDto | UpdateShipmentDto,
  ): Promise<void> {
    // Order
    if (dto.orderId) {
      const order = await this.orderRepository.findOneBy({ id: dto.orderId });
      if (!order) {
        throw new NotFoundException(
          `Order with ID ${dto.orderId} not found`,
        );
      }
    }

    // Address
    if (dto.deliveryAddressId) {
      const address = await this.addressRepository.findOneBy({
        id: dto.deliveryAddressId,
      });
      if (!address) {
        throw new NotFoundException(
          `Delivery Address with ID ${dto.deliveryAddressId} not found`,
        );
      }
    }

    // Driver (optional)
    if ((dto as any).deliveryDriverId) {
      const driver = await this.userRepository.findOneBy({
        id: (dto as any).deliveryDriverId,
      });
      if (!driver) {
        throw new NotFoundException(
          `Delivery driver with ID ${(dto as any).deliveryDriverId} not found`,
        );
      }
      if (driver.role !== 'DeliveryDriver') {
        throw new BadRequestException(
          `User ${(dto as any).deliveryDriverId} is not a DeliveryDriver`,
        );
      }
    }
  }

  // ---------------------------------------------------------------------------
  // CRUD
  // ---------------------------------------------------------------------------

  async create(createShipmentDto: CreateShipmentDto): Promise<Shipment> {
    await this.validateShipmentRelations(createShipmentDto);

    const shipment = this.shipmentRepository.create({
      status: createShipmentDto.status ?? 'pending',
      estimatedDeliveryAt: createShipmentDto.estimatedDeliveryAt
        ? new Date(createShipmentDto.estimatedDeliveryAt)
        : null,

      order: { id: createShipmentDto.orderId } as Order,
      deliveryAddress: {
        id: createShipmentDto.deliveryAddressId,
      } as Address,

      deliveryDriver: createShipmentDto.deliveryDriverId
        ? ({ id: createShipmentDto.deliveryDriverId } as User)
        : null,
    });

    return this.shipmentRepository.save(shipment);
  }

  async findAll(): Promise<Shipment[]> {
    return this.shipmentRepository.find({
      relations: [
        'order',
        'order.user',
        'order.items',
        'deliveryDriver',
        'deliveryAddress',
      ],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Shipment> {
    const shipment = await this.shipmentRepository.findOne({
      where: { id },
      relations: [
        'order',
        'order.user',
        'order.items',
        'deliveryDriver',
        'deliveryAddress',
      ],
    });

    if (!shipment) {
      throw new NotFoundException(`Shipment with ID ${id} not found`);
    }

    return shipment;
  }

  async update(
    id: number,
    updateShipmentDto: UpdateShipmentDto,
  ): Promise<Shipment> {
    await this.findOne(id);
    await this.validateShipmentRelations(updateShipmentDto);

    const updateData: any = {
      ...updateShipmentDto,
      deliveryDriver: updateShipmentDto.deliveryDriverId
        ? ({ id: updateShipmentDto.deliveryDriverId } as User)
        : undefined,
      deliveryAddress: updateShipmentDto.deliveryAddressId
        ? ({ id: updateShipmentDto.deliveryAddressId } as Address)
        : undefined,
    };

    await this.shipmentRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.shipmentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Shipment with ID ${id} not found`);
    }
  }

  // ---------------------------------------------------------------------------
  // Rider – Queries
  // ---------------------------------------------------------------------------

  /** Shipments disponibles para riders */
  async findAvailable(): Promise<Shipment[]> {
    return this.shipmentRepository.find({
      where: [
        { deliveryDriver: null, status: 'pending' },
        { deliveryDriver: null, status: 'processing' },
      ],
      relations: [
        'order',
        'order.user',
        'order.items',
        'deliveryAddress',
      ],
      order: { id: 'DESC' },
    });
  }

  /** Shipments asignados a un rider (activos + historial) */
  async findByDriver(driverId: number): Promise<Shipment[]> {
    return this.shipmentRepository.find({
      where: { deliveryDriver: { id: driverId } as any },
      relations: [
        'order',
        'order.user',
        'order.items',
        'deliveryDriver',
        'deliveryAddress',
      ],
      order: { assignedAt: 'DESC' as any },
    });
  }

  // ---------------------------------------------------------------------------
  // Rider – Actions
  // ---------------------------------------------------------------------------

  /** Aceptar pedido (asignar rider) */
  async assignDriverAndUpdateStatus(
    shipmentId: number,
    driverId: number,
    status?: ShipmentStatus,
  ): Promise<Shipment> {
    const shipment = await this.findOne(shipmentId);

    // 🚫 Bloquear doble asignación
    if (shipment.deliveryDriver) {
      throw new ConflictException(
        `Shipment ${shipmentId} is already assigned`,
      );
    }

    const driver = await this.userRepository.findOneBy({ id: driverId });
    if (!driver) {
      throw new NotFoundException(
        `Delivery driver with ID ${driverId} not found`,
      );
    }

    if (driver.role !== 'DeliveryDriver') {
      throw new BadRequestException(
        `User ${driverId} is not a DeliveryDriver`,
      );
    }

    shipment.deliveryDriver = driver;
    shipment.assignedAt = new Date();

    shipment.status = status ?? 'processing';

    return this.shipmentRepository.save(shipment);
  }

  /** Cambiar estado del shipment (retiro / entrega) */
  async updateStatus(
    id: number,
    newStatus: ShipmentStatus,
  ): Promise<Shipment> {
    const shipment = await this.findOne(id);

    const allowed: Record<ShipmentStatus, ShipmentStatus[]> = {
      pending: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered', 'returned'],
      delivered: ['returned'],
      returned: [],
      cancelled: [],
    };

    if (!allowed[shipment.status]?.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition: ${shipment.status} → ${newStatus}`,
      );
    }

    shipment.status = newStatus;

    if (newStatus === 'delivered' && !shipment.deliveredAt) {
      shipment.deliveredAt = new Date();
    }

    return this.shipmentRepository.save(shipment);
  }
}
