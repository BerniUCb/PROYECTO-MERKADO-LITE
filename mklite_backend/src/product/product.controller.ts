import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product-dto";

@Controller('/product')
export class ProductController {

  constructor(private readonly productService: ProductService) {}

  // ─────────────────────────────────────────────
  // STATS Y QUERIES ESPECÍFICAS (deben ir primero)
  // ─────────────────────────────────────────────

  @Get('/top-selling')
  getTopSellingProducts() {
    return this.productService.getTopSellingProducts();
  }

  @Get('/count')
  async getTotalProductsCount() {
    return { totalProducts: await this.productService.getTotalProductsCount() };
  }

  @Get('/count/in-stock')
  async getInStockCount() {
    return { inStock: await this.productService.getInStockCount() };
  }

  @Get('/count/out-of-stock')
  async getOutOfStockCount() {
    return { outOfStock: await this.productService.getOutOfStockCount() };
  }

  @Get('/category/:categoryId')
  async getProductsByCategory(@Param('categoryId') categoryId: number) {
    return this.productService.getProductsByCategory(categoryId);
  }

  @Get('/paginated')
  async getPaginatedProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 15,
  ) {
    return this.productService.getPaginatedProducts(Number(page), Number(limit));
  }

  // ─────────────────────────────────────────────
  // CRUD (van abajo, con /:id al final)
  // ─────────────────────────────────────────────

  @Post()
  createProduct(@Body() dto: CreateProductDto) {
    return this.productService.createProduct(dto);
  }

  @Put('/:id')
  updateProduct(@Param('id') id: number, @Body() dto: UpdateProductDto) {
    return this.productService.updateProduct(id, dto);
  }

  @Delete('/:id')
  deleteProduct(@Param('id') id: number) {
    return this.productService.deleteProduct(id);
  }

  // 🚨 Debe ser la ÚLTIMA ruta SIEMPRE
  @Get('/:id')
  getProductById(@Param('id') id: number) {
    return this.productService.getProductById(id);
  }
}
