import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { OrderItemService } from "./order-item.service";
import { OrderItem } from "src/entity/order-item.entity";
import { CreateOrderItemDto } from "./dto/create-order-item.dto";
import { UpdateOrderItemDto } from "./dto/update-order-item.dto";


@Controller('/order-item')
export class OrderItemController {

    constructor(private readonly orderItemService: OrderItemService) {}

    @Post()
    createOrderItem(@Body() dto: CreateOrderItemDto) {
    return this.orderItemService.createOrderItem(dto);
}

    @Get()
    getAllOrderItems() {
        return this.orderItemService.getAllOrderItems();
    }

    @Get('/:id') 
    getOrderItemById(@Param('id') id: number) {
        return this.orderItemService.getOrderItemById(id);
    }

    @Delete('/:id')
    deleteOrderItem(@Param('id') id: number) {
        return this.orderItemService.deleteOrderItem(id);
    }

    @Put('/:id')
    updateOrderItem(@Param('id') id: number, @Body() dto: UpdateOrderItemDto) {
    return this.orderItemService.updateOrderItem(id, dto);
}



}
