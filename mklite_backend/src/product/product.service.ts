
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from '../entity/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product-dto';

@Injectable()
export class ProductService {
  
  constructor(
    @InjectRepository(Producto)
    private readonly productRepository: Repository<Producto>,
  ) {}

async createProduct(dto: CreateProductDto): Promise<Producto> {
    
    const newProduct = this.productRepository.create({
        nombre: dto.nombre,
        descripcion: dto.descripcion,
        precioVenta: dto.precio,  
        categoria: { id: dto.categoriaId }
    });
    return await this.productRepository.save(newProduct);
  }

  async getAllProducts(): Promise<Producto[]> {
   
    return await this.productRepository.find();
  }

  async getProductById(id: number): Promise<Producto> {
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

  async updateProduct(id: number, dto: Partial<CreateProductDto>): Promise<Producto> {
    
    // Usamos 'preload' para cargar el usuario existente y fusionar los nuevos datos.
    const productToUpdate = await this.productRepository.preload({
        id,
        nombre: dto.nombre,
        descripcion: dto.descripcion,
        precioVenta: dto.precio,
        categoria: dto.categoriaId ? { id: dto.categoriaId } : undefined
    });

    if (!productToUpdate) {
        throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return await this.productRepository.save(productToUpdate);
  }
}
