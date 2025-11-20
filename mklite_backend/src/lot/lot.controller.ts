// src/lote/lot.controller.ts
import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { Lote } from "src/entity/lot.entity";
import { LotService } from "./lot.service";

@Controller('/lot') 
export class LotController {

  constructor(private readonly lotService: LotService) {}

  @Post()
  createLote(@Body() lote: Lote) {
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
  updateLote(@Param() params: any, @Body() lote: Partial<Lote>) {
    return this.lotService.updateLote(params.id, lote);
  }
}