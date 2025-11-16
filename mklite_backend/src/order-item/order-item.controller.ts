import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { OrderItemService } from "./order-item.service";
import { DetallePedido } from "src/entity/order-item.entity";


@Controller('/order-item')
export class OrderItemController {

    constructor(private readonly orderItemService: OrderItemService) {}

    @Post()
    createOrderItem(@Body() orderItem: DetallePedido) {
        return this.orderItemService.createOrderItem(orderItem);
    }

    @Get()
    getAllOrderItems() {
        return this.orderItemService.getAllOrderItems();
    }

    @Get('/:id') 
    getOrderItemById(@Param() params: any) {
        return this.orderItemService.getOrderItemById(params.id);
    }

    @Delete('/:id')
    deleteOrderItem(@Param() params: any) {
        return this.orderItemService.deleteOrderItem(params.id);
    }

    @Put('/:id')
    updateOrderItem(@Param() params: any,  @Body() orderItem: DetallePedido) {
        return this.orderItemService.updateOrderItem(params.id, orderItem);
    }


}
