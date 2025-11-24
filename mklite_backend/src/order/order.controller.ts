import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Query } from '@nestjs/common/decorators';
import { Order } from 'src/entity/order.entity';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  //Reportes
  @Get('report/total-sales')
  getTotalSales(){
    return this.orderService.getTotalSales();
  }

  @Get('report/pending-count')
  getPendingOrderCount(){
    return this.orderService.getPendingOrderCount();
  }

  @Get('report/weekly-sales')
  getWeeklySales(){
    return this.orderService.getWeeklySales();
  }

  @Get('report/latest')
  getLatestOrders(){
    return this.orderService.getLatestOrders();
  }
  //CRUD

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sort') sort?: string,
    @Query('order') order?: 'asc' | 'desc',
    ): Promise<Order[]> {
        return this.orderService.findAll(page, limit, sort, order);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.orderService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateOrderDto: UpdateOrderDto){
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.orderService.remove(id);
  }
  @Get('stats/last-7-days')
  async getLast7DaysSales(): Promise<number[]> {
  return this.orderService.getLast7DaysSales();
  }

}
