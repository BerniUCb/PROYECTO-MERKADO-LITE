// En: src/address/address.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Patch, ParseIntPipe } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

// La ruta base ahora puede ser más semántica
@Controller('users/:userId/address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  // CREATE -> POST /users/1/address
  @Post()
create(
    @Param('userId', ParseIntPipe) userId: number, // <-- Obtenemos el userId de la URL
    @Body() createAddressDto: CreateAddressDto,
  ) {
    return this.addressService.create(createAddressDto, userId);
  }

  // READ ALL -> GET /users/1/address
  @Get()
  findAll(
    @Param('userId', ParseIntPipe) userId: number, // <-- Obtenemos el userId de la URL
  ) {
    return this.addressService.findAllByUser(userId);
  }

  // READ ONE -> GET /users/1/address/123
  // Para que esto funcione, necesitamos mover el :id al final
  @Get(':addressId')
  findOne(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('addressId', ParseIntPipe) addressId: number, // <-- Nuevo parámetro para el ID de la dirección
  ) {
    return this.addressService.findOne(addressId, userId);
  }

  // DELETE -> DELETE /users/1/address/123
  @Delete(':addressId')
  remove(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('addressId', ParseIntPipe) addressId: number,
  ) {
    return this.addressService.remove(addressId, userId);
  }

  // UPDATE -> PATCH /users/1/address/123
  @Patch(':addressId')
  update(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('addressId', ParseIntPipe) addressId: number,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.addressService.update(addressId, updateAddressDto, userId);
  }
}