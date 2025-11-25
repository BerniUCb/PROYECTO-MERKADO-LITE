
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entity/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product-dto';
import { MoreThan } from 'typeorm';


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
   
    return await this.productRepository.find({relations: {category: true,},});
  }

  async getProductById(id: number): Promise<Product> {
   const product = await this.productRepository.findOne({where: { id },relations: {category: true, },});

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


async getTopSellingProducts(limit = 10): Promise<any[]> {
    // Usamos una consulta segura que evita errores de GROUP BY strict mode
    const rawData = await this.productRepository
      .createQueryBuilder('product')
      // Hacemos join con orderItem. Asegúrate de que la relación exista en tu entity Product.
      // Si no existe la relación en la entidad, cambia esto por un join manual.
      .leftJoin('product.orderItems', 'orderItem') 
      .select([
        'product.id AS id',
        'product.name AS name',
        'product.salePrice AS "salePrice"', // Comillas para mantener camelCase en Postgres
        'product.physicalStock AS "physicalStock"',
        'product.imageUrl AS "imageUrl"',
        'SUM(orderItem.quantity) AS "totalSold"'
      ])
      .groupBy('product.id')
      // Postgres requiere agrupar por las columnas seleccionadas o usar funciones de agregación
      .addGroupBy('product.name')
      .addGroupBy('product.salePrice')
      .addGroupBy('product.physicalStock')
      .addGroupBy('product.imageUrl')
      .orderBy('"totalSold"', 'DESC') // Ordenamos por el alias
      .limit(limit)
      .getRawMany();

    // Mapeamos para asegurar que los números sean numéricos (Postgres devuelve strings en SUM)
    return rawData.map(item => ({
      id: item.id,
      name: item.name,
      salePrice: Number(item.salePrice),
      physicalStock: Number(item.physicalStock),
      imageUrl: item.imageUrl,
      totalSold: Number(item.totalSold || 0)
    }));
  }


/////////////////////
async getTotalProductsCount(): Promise<number> {
  return await this.productRepository.count();
}

async getInStockCount(): Promise<number> {
  return await this.productRepository.count({
    where: { physicalStock: MoreThan(0) }, 
  });
}

async getOutOfStockCount(): Promise<number> {
  return await this.productRepository.count({
    where: { physicalStock: 0 },
  });
}

async getProductsByCategory(categoryId: number): Promise<Product[]> {
  const products = await this.productRepository.find({
    where: { category: { id: categoryId } },
    relations: { category: true },
  });

  if (products.length === 0) {
    throw new NotFoundException(`No products found for category ID "${categoryId}"`);
  }

  return products;
}


}
