import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { AssignShipmentDto } from './dto/assign-shipment.dto';
import { UpdateShipmentStatusDto } from './dto/update-shipment-status.dto';

@Controller('shipments')
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) {}

  // ---------------- Rider Endpoints (poner antes de :id) ----------------

  /** Shipments disponibles para riders */
  @Get('available')
  findAvailable() {
    return this.shipmentService.findAvailable();
  }

  /** Shipments asignados a un rider (activos + historial) */
  @Get('by-driver/:driverId')
  findByDriver(@Param('driverId', ParseIntPipe) driverId: number) {
    return this.shipmentService.findByDriver(driverId);
  }

  // ---------------- CRUD ----------------

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createShipmentDto: CreateShipmentDto) {
    return this.shipmentService.create(createShipmentDto);
  }

  @Get()
  findAll() {
    return this.shipmentService.findAll();
  }

  /** Asignar rider y opcionalmente actualizar estado */
  @Patch(':id/assign')
  assignDriver(
    @Param('id', ParseIntPipe) id: number,
    @Body() assignDto: AssignShipmentDto,
  ) {
    return this.shipmentService.assignDriverAndUpdateStatus(
      id,
      assignDto.driverId,
      assignDto.status,
    );
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

  /** Actualizar estado (retiro / entrega) */
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateShipmentStatusDto,
  ) {
    return this.shipmentService.updateStatus(id, updateStatusDto.status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.shipmentService.remove(id);
  }
}
