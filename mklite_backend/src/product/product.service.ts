
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entity/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product-dto';

@Injectable()
export class ProductService {
  
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createProduct(dto: CreateProductDto): Promise<Product> {
    const newProduct = this.productRepository.create({
      name: dto.name,
      description: dto.description ?? null,
      salePrice: dto.salePrice,
      unitOfMeasure: dto.unitOfMeasure ?? 'Unit',
      physicalStock: dto.physicalStock ?? 0,
      reservedStock: dto.reservedStock ?? 0,
      imageUrl: dto.imageUrl ?? null,
      isActive: dto.isActive ?? true,
      category: dto.category_id ? { id: dto.category_id } : null
    });
  return await this.productRepository.save(newProduct);
  }

  async getAllProducts(): Promise<Product[]> {
   
    return await this.productRepository.find();
  }

  async getProductById(id: number): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });
     
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }

  async deleteProduct(id: number): Promise<{ deleted: boolean; affected?: number }> {
    const result = await this.productRepository.delete({ id }); // Borramos por la propiedad 'id'

    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return { deleted: true, affected: result.affected ?? 0 };
  }

  async updateProduct(id: number, dto: UpdateProductDto): Promise<Product> {

    const productToUpdate = await this.productRepository.preload({
      id,
      name: dto.name,
      description: dto.description,
      salePrice: dto.salePrice,
      unitOfMeasure: dto.unitOfMeasure,
      physicalStock: dto.physicalStock,
      reservedStock: dto.reservedStock,
      imageUrl: dto.imageUrl,
      isActive: dto.isActive,
      category: dto.category_id ? { id: dto.category_id } : undefined
  });
  if (!productToUpdate) {
    throw new NotFoundException(`Product with ID "${id}" not found`);
  }
  return await this.productRepository.save(productToUpdate);
}

}
