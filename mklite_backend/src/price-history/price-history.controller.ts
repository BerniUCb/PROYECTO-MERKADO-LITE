import { Controller, Get, Post, Param, Body, Delete } from '@nestjs/common';
import { PriceHistoryService } from './price-history.service';
import { CreatePriceHistoryDto } from './dto/create-price-history.dto';

@Controller('/price-history')
export class PriceHistoryController {

  constructor(private readonly priceHistoryService: PriceHistoryService) {}

  @Post()
  create(@Body() dto: CreatePriceHistoryDto) {
    return this.priceHistoryService.create(dto);
  }

  @Get()
  findAll() {
    return this.priceHistoryService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: number) {
    return this.priceHistoryService.findOne(id);
  }

  @Get('/product/:productId')
  findByProduct(@Param('productId') productId: number) {
    return this.priceHistoryService.findByProduct(productId);
  }

  @Delete('/:id')
  delete(@Param('id') id: number) {
    return this.priceHistoryService.delete(id);
  }
}
