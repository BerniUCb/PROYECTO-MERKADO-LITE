import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { PromotionService } from "./promotion.service";
import { Promocion } from "src/entity/promotion.entity";


@Controller('/promotion')
export class PromotionController {
    constructor(private readonly promotionService: PromotionService) {}

    @Post()
    createPromotion(@Body() promotion: Promocion) {
        return this.promotionService.createPromotion(promotion);
    }

    @Get()
    getAllPromotions() {
        return this.promotionService.getAllPromotions();
    }

    @Get('/:id') 
    getPromotionById(@Param() params: any) {
        return this.promotionService.getPromotionById(params.id);
    }

    @Delete('/:id')
    deletePromotion(@Param() params: any) {
        return this.promotionService.deletePromotion(params.id);
    }

    @Put('/:id')
    updatePromotion(@Param() params: any,  @Body() promotion: Promocion) {
        return this.promotionService.updatePromotion(params.id, promotion);
    }

}