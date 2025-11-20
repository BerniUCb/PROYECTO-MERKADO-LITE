// src/address/address.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';


@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  // CREATE -> POST /address
  @Post()
  create(@Body() createAddressDto: CreateAddressDto) {
    // NOTA: Aquí asumimos un usuarioId fijo (1). En un sistema real,
    // esto vendría de un sistema de autenticación (ej. un decorador @GetUser()).
    const userId = 1; 
    return this.addressService.create(createAddressDto, userId);
  }

  // READ ALL -> GET /address
  @Get()
  findAll() {
    const userId = 1; // De nuevo, esto sería dinámico.
    return this.addressService.findAllByUser(userId);
  }

  // READ ONE -> GET /address/123
  @Get(':id')
  findOne(@Param('id') id: string) {
    const userId = 1; // Sería dinámico.
    return this.addressService.findOne(+id, userId);
  }

  // DELETE -> DELETE /address/123
  @Delete(':id')
  remove(@Param('id') id: string) {
    const userId = 1; // Sería dinámico.
    return this.addressService.remove(+id, userId);
  }
    @Patch(':id')
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    const userId = 1; // De nuevo, esto sería dinámico.
    return this.addressService.update(+id, updateAddressDto, userId);
  }
}