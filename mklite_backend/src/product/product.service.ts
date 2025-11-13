// src/user/user.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from '../entity/product.entity';

// ¡Ya no importamos AppDataSource directamente!

@Injectable()
export class ProductService {
  // Inyectamos el Repositorio de User. NestJS y TypeOrmModule se encargan de crearlo
  // y dárnoslo listo para usar.
  constructor(
    @InjectRepository(Producto)
    private readonly productRepository: Repository<Producto>,
  ) {}

  async createProduct(product: Producto): Promise<Producto> {
    // Usamos el repositorio para guardar la nueva entidad de producto.
    const newProduct = this.productRepository.create(product); // 'create' prepara el objeto para guardarlo
    return await this.productRepository.save(newProduct);
  }

  async getAllProducts(): Promise<Producto[]> {
    // Usamos el repositorio para encontrar todos los productos.
    return await this.productRepository.find();
  }

  async getProductById(id: number): Promise<Producto> {
    const product = await this.productRepository.findOneBy({ id });
     // Buscamos por la propiedad 'id'

    // Es una buena práctica verificar si el producto fue encontrado.
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

  async updateProduct(id: number, productUpdateData: Partial<Producto>): Promise<Producto> {
    
    // Usamos 'preload' para cargar el usuario existente y fusionar los nuevos datos.
    const ProductToUpdate = await this.productRepository.preload({
      id: id,
      ...productUpdateData,
    });

    if (!ProductToUpdate) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    // Guardamos la entidad actualizada.
    return await this.productRepository.save(ProductToUpdate);
  }
}