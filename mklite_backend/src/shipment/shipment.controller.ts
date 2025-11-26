// src/shipment/shipment.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpCode,HttpStatus} from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { AssignShipmentDto } from './dto/assign-shipment.dto'; 

@Controller('shipments') // Plural por convención REST
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) {}

  // ---------------- CRUD BÁSICO ----------------

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createShipmentDto: CreateShipmentDto) {
    return this.shipmentService.create(createShipmentDto);
  }

  @Get()
  findAll() {
    return this.shipmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.shipmentService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateShipmentDto: UpdateShipmentDto,
  ) {
    return this.shipmentService.update(id, updateShipmentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.shipmentService.remove(id);
  }
  
  // ---------------- MÉTODO ADICIONAL ----------------

  /**
   * Asigna un repartidor y opcionalmente actualiza el estado.
   * E.g.: PATCH /shipments/123/assign
   */
  @Patch(':id/assign')
  assignDriver(@Param('id', ParseIntPipe) id: number, @Body() assignDto: AssignShipmentDto,) {
    return this.shipmentService.assignDriverAndUpdateStatus(
        id, 
        assignDto.driverId, 
        assignDto.status
    );
  }
}