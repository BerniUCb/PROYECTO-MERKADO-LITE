import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ProductService } from "./product.service";
import { Producto } from "src/entity/product.entity";


@Controller('/product')
export class ProductController {

    constructor(private readonly productService: ProductService) {}

    @Post()
    createProduct(@Body() product: Producto) {
        return this.productService.createProduct(product);
    }

    @Get()
    getAllProducts() {
        return this.productService.getAllProducts();
    }

    @Get('/:id') 
    getProductById(@Param() params: any) {
        return this.productService.getProductById(params.id);
    }

    @Delete('/:id')
    deleteProduct(@Param() params: any) {
        return this.productService.deleteProduct(params.id);
    }

    @Put('/:id')
    updateProduct(@Param() params: any,  @Body() product: Producto) {
        return this.productService.updateProduct(params.id, product);
    }


}
