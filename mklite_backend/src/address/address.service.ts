import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Direccion } from '../entity/address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Direccion)
    private readonly direccionRepository: Repository<Direccion>,
  ) {}

  // CREATE
  async create(createAddressDto: CreateAddressDto, usuarioId: number): Promise<Direccion> {
    const nuevaDireccion = this.direccionRepository.create({
      ...createAddressDto,
      usuario: { id: usuarioId }, // Asocia la dirección al usuario
    });
    return this.direccionRepository.save(nuevaDireccion);
  }

  // READ ALL from a user
  async findAllByUser(usuarioId: number): Promise<Direccion[]> {
    return this.direccionRepository.find({
      where: { usuario: { id: usuarioId } },
    });
  }

  // READ ONE
  async findOne(id: number, usuarioId: number): Promise<Direccion> {
    const direccion = await this.direccionRepository.findOne({
      where: { id, usuario: { id: usuarioId } },
    });
    if (!direccion) {
      throw new NotFoundException(`La dirección con el ID #${id} no fue encontrada o no pertenece al usuario.`);
    }
    return direccion;
  }

  // DELETE
  async remove(id: number, usuarioId: number): Promise<void> {
    const result = await this.direccionRepository.delete({ id, usuario: { id: usuarioId } });
    if (result.affected === 0) {
      throw new NotFoundException(`La dirección con el ID #${id} no fue encontrada o no pertenece al usuario.`);
    }
  }

  async update(id: number, updateAddressDto: UpdateAddressDto, usuarioId: number): Promise<Direccion> {
    const direccion = await this.findOne(id, usuarioId); // Reutilizamos findOne para validar
    const direccionActualizada = this.direccionRepository.merge(direccion, updateAddressDto);
    return this.direccionRepository.save(direccionActualizada);
  }
}