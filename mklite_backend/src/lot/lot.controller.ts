// src/Lot/lot.controller.ts
import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { Lot } from "src/entity/lot.entity";
import { LotService } from "./lot.service";

@Controller('/lot') 
export class LotController {

  constructor(private readonly lotService: LotService) {}

  @Post()
  createLot(@Body() Lot: Lot) {
    return this.lotService.createLot(Lot);
  }

  @Get()
  getAllLots() {
    return this.lotService.getAllLots();
  }

  @Get('/:id')
  getLotById(@Param() params: any) {
    return this.lotService.getLotById(params.id);
  }

  @Delete('/:id')
  deleteLot(@Param() params: any) {
    return this.lotService.deleteLot(params.id);
  }

  @Put('/:id')
  updateLot(@Param() params: any, @Body() Lot: Partial<Lot>) {
    return this.lotService.updateLot(params.id, Lot);
  }
}