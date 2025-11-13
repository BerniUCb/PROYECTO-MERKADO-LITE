import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { PedidoService } from './order.service';

@Controller('pedido')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Post()
  create(@Body() data: any) {
    return this.pedidoService.create(data);
  }

  @Get()
  findAll() {
    return this.pedidoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.pedidoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() data: any) {
    return this.pedidoService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.pedidoService.remove(id);
  }
}
