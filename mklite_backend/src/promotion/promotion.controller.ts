import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { PromotionService } from "./promotion.service";
import { Promotion } from "src/entity/promotion.entity";


@Controller('/promotion')
export class PromotionController {
    constructor(private readonly promotionService: PromotionService) {}

    @Post()
    createPromotion(@Body() promotion: Promotion) {
        return this.promotionService.createPromotion(promotion);
    }

    @Get()
    getAllPromotions() {
        return this.promotionService.getAllPromotions();
    }

    @Get('/:id') 
    getPromotionById(@Param('id') id: number) {
        return this.promotionService.getPromotionById(id);
    }

    @Delete('/:id')
    deletePromotion(@Param('id') id: number) {
        return this.promotionService.deletePromotion(id);
    }

    @Put('/:id')
    updatePromotion(@Param('id') id: number,  @Body() promotion: Promotion) {
        return this.promotionService.updatePromotion(id, promotion);
    }

}