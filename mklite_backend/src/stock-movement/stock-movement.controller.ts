import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { StockMovementService } from './stock-movement.service';
import { CreateStockMovementDto } from './dto/create-stock.dto';
import { UpdateStockMovementDto } from './dto/update-stock.dto';

@Controller('stock-movements')
export class StockMovementController {
  constructor(private readonly stockMovementService: StockMovementService) {}

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sort') sort?: string,
    @Query('order') order?: 'asc' | 'desc',
  ) {
    return this.stockMovementService.findAll(page, limit, sort, order);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockMovementService.findOne(+id);
  }
  @Post()
  create(@Body() dto: CreateStockMovementDto) {
    return this.stockMovementService.create(dto);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateStockMovementDto) {
    return this.stockMovementService.update(+id, dto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stockMovementService.remove(+id);
  }
}