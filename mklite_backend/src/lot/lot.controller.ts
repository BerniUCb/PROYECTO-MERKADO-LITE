// src/lote/lot.controller.ts
import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { Lot } from "src/entity/lot.entity";
import { LotService } from "./lot.service";

@Controller('/lotes') 
export class LotController {

  constructor(private readonly lotService: LotService) {}

  @Post()
  createLote(@Body() lote: Lot) {
    return this.lotService.createLote(lote);
  }

  @Get()
  getAllLotes() {
    return this.lotService.getAllLotes();
  }

  @Get('/:id')
  getLoteById(@Param() params: any) {
    return this.lotService.getLoteById(params.id);
  }

  @Delete('/:id')
  deleteLote(@Param() params: any) {
    return this.lotService.deleteLote(params.id);
  }

  @Put('/:id')
  updateLote(@Param() params: any, @Body() lote: Partial<Lot>) {
    return this.lotService.updateLote(params.id, lote);
  }
}