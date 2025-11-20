// src/address/address.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from '../entity/address.entity'; // <-- Corregido
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address) // <-- Corregido
    private readonly addressRepository: Repository<Address>, // <-- Corregido
  ) {}

  // CREATE
  async create(createAddressDto: CreateAddressDto, userId: number): Promise<Address> { // <-- Corregido
    const newAddress = this.addressRepository.create({ // <-- Corregido
      ...createAddressDto,
      user: { id: userId }, // <-- Corregido para que coincida con la entidad User
    });
    return this.addressRepository.save(newAddress); // <-- Corregido
  }

  // READ ALL from a user
  async findAllByUser(userId: number): Promise<Address[]> { // <-- Corregido
    return this.addressRepository.find({
      where: { user: { id: userId } }, // <-- Corregido
    });
  }

  // READ ONE
  async findOne(id: number, userId: number): Promise<Address> { // <-- Corregido
    const address = await this.addressRepository.findOne({ // <-- Corregido
      where: { id, user: { id: userId } }, // <-- Corregido
    });
    if (!address) {
      throw new NotFoundException(`Address with ID #${id} not found or does not belong to the user.`);
    }
    return address; // <-- Corregido
  }

  // DELETE
  async remove(id: number, userId: number): Promise<void> {
    const result = await this.addressRepository.delete({ id, user: { id: userId } }); // <-- Corregido
    if (result.affected === 0) {
      throw new NotFoundException(`Address with ID #${id} not found or does not belong to the user.`);
    }
  }

  // UPDATE
  async update(id: number, updateAddressDto: UpdateAddressDto, userId: number): Promise<Address> { // <-- Corregido
    const address = await this.findOne(id, userId);
    const updatedAddress = this.addressRepository.merge(address, updateAddressDto); // <-- Corregido
    return this.addressRepository.save(updatedAddress); // <-- Corregido
  }
}