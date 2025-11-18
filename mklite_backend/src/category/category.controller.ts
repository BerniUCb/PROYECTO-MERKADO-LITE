import { Body, Controller, Delete, Get, Param, Post, Put, ParseIntPipe } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { Categoria } from "src/entity/category.entity";


@Controller('/category')
export class CategoryController{
    constructor(private readonly categoryService :  CategoryService){}

    @Post()
    createCategory(@Body() category: Categoria){
        return this.categoryService.createCategory(category);
    }

    @Get()
    getAllCategories(){
        return this.categoryService.getAllCategories();
    }

    @Get(':id')
    getCategoryById(@Param() params: any){
        return this.categoryService.getCategoryById(params.id);
    }

    @Delete(':id')
    deleteCategory(@Param() params: any){
        return this.categoryService.deleteCategory(params.id);
    }

    @Put(':id')
    updateCategory(@Param('id', ParseIntPipe) id: number, @Body() category: Categoria){
        return this.categoryService.updateCategory(id, category);
    }
}