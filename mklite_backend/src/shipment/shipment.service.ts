// src/shipment/shipment.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shipment, ShipmentStatus } from '../entity/shipment.entity';
import { CreateShipmentDto } from './dto/create-shipment.dto'; 
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { User } from '../entity/user.entity'; // Necesario para buscar al repartidor

@Injectable()
export class ShipmentService {
  constructor(
    @InjectRepository(Shipment)
    private shipmentRepository: Repository<Shipment>,
    @InjectRepository(User)
    private userRepository: Repository<User>, // Para verificar que el repartidor exista
  ) {}

  // ---------------- CRUD BÁSICO ----------------

  private async findAndValidateRelations(dto: CreateShipmentDto | UpdateShipmentDto) {
    if (dto.deliveryDriverId) {
      const driver = await this.userRepository.findOneBy({ id: dto.deliveryDriverId });
      if (!driver) {
        throw new NotFoundException(`Delivery driver with ID ${dto.deliveryDriverId} not found.`);
      }
    }
  }

  async create(createShipmentDto: CreateShipmentDto): Promise<Shipment> {
    await this.findAndValidateRelations(createShipmentDto);
    
    const shipment = this.shipmentRepository.create({
      ...createShipmentDto,
      order: { id: createShipmentDto.orderId } as any,
      deliveryDriver: createShipmentDto.deliveryDriverId ? { id: createShipmentDto.deliveryDriverId } as any : null,
      deliveryAddress: { id: createShipmentDto.deliveryAddressId } as any,
    });
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
    await this.findAndValidateRelations(updateShipmentDto);
    
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
}