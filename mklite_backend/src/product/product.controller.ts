import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ProductService } from "./product.service";
import { Product } from "src/entity/product.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product-dto";


@Controller('/product')
export class ProductController {

    constructor(private readonly productService: ProductService) {}

    @Post()
    createProduct(@Body() dto: CreateProductDto) {
        return this.productService.createProduct(dto);
    }

    @Get()
    getAllProducts() {
        return this.productService.getAllProducts();
    }

    @Get('/:id') 
    getProductById(@Param('id') id: number) {
        return this.productService.getProductById(id);
    }

    @Delete('/:id')
    deleteProduct(@Param('id') id: number) {
        return this.productService.deleteProduct(id);
    }

    @Put('/:id')
    updateProduct(@Param('id') id: number, @Body() dto: UpdateProductDto) {
        return this.productService.updateProduct(id, dto);
    }


}
