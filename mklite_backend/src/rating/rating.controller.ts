import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';

@Controller('rating')
export class RatingController{
    constructor(private readonly ratingService: RatingService){}
    @Post()
    create(@Body() dto: CreateRatingDto){
        return this.ratingService.create(dto);
    }
    @Get()
    findAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('sort') sort?: string,
        @Query('order') order?: 'asc' | 'desc',
    ){
        return this.ratingService.findAll(page, limit, sort, order);
    }
    @Get(':id')
    findOne(@Param('id') id: string){
        return this.ratingService.findOne(+id);
    }
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateRatingDto){
        return this.ratingService.update(+id, dto);
    }
    @Delete(':id')
    remove(@Param('id') id:string){
        return this.ratingService.remove(+id);
    }
}