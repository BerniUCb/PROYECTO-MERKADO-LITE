import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { OrderItemService } from "./order-item.service";
import { OrderItem } from "src/entity/order-item.entity";


@Controller('/order-item')
export class OrderItemController {

    constructor(private readonly orderItemService: OrderItemService) {}

    @Post()
    createOrderItem(@Body() orderItem: OrderItem) {
        return this.orderItemService.createOrderItem(orderItem);
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
    updateOrderItem(@Param('id') id: number,  @Body() orderItem: OrderItem) {
        return this.orderItemService.updateOrderItem(id, orderItem);
    }


}
