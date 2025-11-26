// src/shipment/shipment.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shipment, ShipmentStatus } from '../entity/shipment.entity';
import { CreateShipmentDto } from './dto/create-shipment.dto'; 
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { User } from '../entity/user.entity'; // Necesario para buscar al repartidor
import { Order } from 'src/entity/order.entity';
import { Address } from 'src/entity/address.entity';

@Injectable()
export class ShipmentService {
  constructor(
    @InjectRepository(Shipment)
    private shipmentRepository: Repository<Shipment>,
    @InjectRepository(User)
    private userRepository: Repository<User>, 
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(User)
    private addressRepository: Repository<Address>,
  ) {}


  private async validateShipmentRelations(dto: CreateShipmentDto | UpdateShipmentDto) {
    
    // 1. Validar OrderId (obligatorio para la creación)
    if (dto.orderId) {
        const order = await this.orderRepository.findOneBy({ id: dto.orderId });
        if (!order) {
            throw new NotFoundException(`Order with ID ${dto.orderId} not found.`);
        }
    }
    
    // 2. Validar AddressId
    if (dto.deliveryAddressId) {
        const address = await this.addressRepository.findOneBy({ id: dto.deliveryAddressId });
        if (!address) {
            throw new NotFoundException(`Delivery Address with ID ${dto.deliveryAddressId} not found.`);
        }
    }

    // 3. Validar Repartidor (opcional)
    if (dto.deliveryDriverId) {
      const driver = await this.userRepository.findOneBy({ id: dto.deliveryDriverId });
      if (!driver) {
        throw new NotFoundException(`Delivery driver with ID ${dto.deliveryDriverId} not found.`);
      }
    }
  }
  // ---------------- CRUD BÁSICO ----------------

  async create(createShipmentDto: CreateShipmentDto): Promise<Shipment> {
    // 1. Validar que las entidades existan antes de la creación
    await this.validateShipmentRelations(createShipmentDto);
    
    // 2. Crear el objeto con las relaciones
    const shipment = this.shipmentRepository.create({
      // Copiar propiedades de fecha/estado (si existen en el DTO)
      ...createShipmentDto, 
      
      // Asignar IDs de relaciones
      order: { id: createShipmentDto.orderId },
      deliveryAddress: { id: createShipmentDto.deliveryAddressId },
      deliveryDriver: createShipmentDto.deliveryDriverId ? { id: createShipmentDto.deliveryDriverId } : null,
      
      // Asegurar que las propiedades de fecha sean Date objects
      estimatedDeliveryAt: createShipmentDto.estimatedDeliveryAt 
          ? new Date(createShipmentDto.estimatedDeliveryAt) 
          : null
    });
    
    // 3. Guardar el nuevo envío.
    // Si la validación anterior pasó, la base de datos no debería dar un error 500 por FK.
    return this.shipmentRepository.save(shipment);
  }

  async findAll(): Promise<Shipment[]> {
    return this.shipmentRepository.find({ 
      relations: ['order', 'deliveryDriver', 'deliveryAddress'] 
    });
  }

  async findOne(id: number): Promise<Shipment> {
    const shipment = await this.shipmentRepository.findOne({
      where: { id },
      relations: ['order', 'deliveryDriver', 'deliveryAddress'],
    });
    if (!shipment) {
      throw new NotFoundException(`Shipment with ID ${id} not found.`);
    }
    return shipment;
  }
  
  async update(id: number, updateShipmentDto: UpdateShipmentDto): Promise<Shipment> {
    await this.findOne(id);
    await this.validateShipmentRelations(updateShipmentDto);
    
    // Mapeo manual de IDs a entidades para TypeORM
    const updateData: any = {
        ...updateShipmentDto,
        deliveryDriver: updateShipmentDto.deliveryDriverId ? { id: updateShipmentDto.deliveryDriverId } : undefined,
        deliveryAddress: updateShipmentDto.deliveryAddressId ? { id: updateShipmentDto.deliveryAddressId } : undefined,
    };
    
    await this.shipmentRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.shipmentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Shipment with ID ${id} not found.`);
    }
  }

  // ---------------- MÉTODOS ADICIONALES ----------------

  /** * @method assignDriverAndUpdateStatus 
   * Asigna un repartidor y opcionalmente actualiza el estado (ej. de 'pending' a 'processing'). 
   */
  async assignDriverAndUpdateStatus(shipmentId: number, driverId: number, status?: ShipmentStatus): Promise<Shipment> {
    const shipment = await this.findOne(shipmentId);
    
    // 1. Validar que el nuevo repartidor exista
    const driver = await this.userRepository.findOneBy({ id: driverId });
    if (!driver) {
        throw new NotFoundException(`Delivery driver with ID ${driverId} not found.`);
    }

    // 2. Aplicar cambios
    shipment.deliveryDriver = driver;
    shipment.assignedAt = new Date(); // Registra la fecha de asignación

    if (status) {
        shipment.status = status;
        // Si el estado es 'shipped', se podría calcular la estimatedDeliveryAt aquí
    } else if (shipment.status === 'pending') {
        // Si no se especifica el estado, moverlo a 'processing' por defecto si estaba en 'pending'
        shipment.status = 'processing';
    }

    return this.shipmentRepository.save(shipment);
  }

  async updateStatus(id: number, newStatus: ShipmentStatus): Promise<Shipment> {
    const shipment = await this.findOne(id);
    
    shipment.status = newStatus;

    // Lógica clave: registrar la fecha de entrega solo si el estado es 'delivered'
    if (newStatus === 'delivered' && !shipment.deliveredAt) {
      shipment.deliveredAt = new Date();
    }
    
    // Si el estado cambia de nuevo (ej. de delivered a returned), la fecha se mantiene
    
    return this.shipmentRepository.save(shipment);
}
}