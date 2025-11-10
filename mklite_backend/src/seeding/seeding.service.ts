// src/seeding/seeding.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, RolUsuario } from '../entity/user.entity';
import { Categoria } from '../entity/category.entity';
import { Producto } from '../entity/product.entity';

@Injectable()
export class SeedingService {
  private readonly logger = new Logger(SeedingService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async seed() {
    this.logger.log('Iniciando proceso de seeding...');

    // Verificamos si ya hay usuarios para no volver a sembrar los datos
    const usersCount = await this.userRepository.count();
    if (usersCount > 0) {
      this.logger.log('La base de datos ya contiene datos. Seeding omitido.');
      return; // Si hay datos, no hacemos nada más
    }

    // =================================================================
    // PASO 1: CREAR USUARIOS BÁSICOS
    // =================================================================
    this.logger.log('Creando usuarios...');
    await this.userRepository.save([
      { nombreCompleto: 'Admin General', email: 'admin@merkado.com', passwordHash: '$2b$10$NotARealHashPlaceholder', rol: 'Administrador' as RolUsuario },
      { nombreCompleto: 'Cliente de Prueba', email: 'cliente@example.com', passwordHash: '$2b$10$NotARealHashPlaceholder', rol: 'Cliente' as RolUsuario },
      { nombreCompleto: 'Repartidor Uno', email: 'repartidor@merkado.com', passwordHash: '$2b$10$NotARealHashPlaceholder', rol: 'Repartidor' as RolUsuario },
    ]);
    
    // =================================================================
    // PASO 2: CREAR LAS CATEGORÍAS
    // =================================================================
    this.logger.log('Creando categorías...');
    const categorias = await this.categoriaRepository.save([
      { nombre: 'Mascotas', descripcion: 'Alimentos y accesorios para mascotas' },
      { nombre: 'Sector Gourmet', descripcion: 'Productos importados y delicatessen' },
      { nombre: 'Bebidas Alcohólicas', descripcion: 'Vinos, cervezas y licores' },
      { nombre: 'Panetones', descripcion: 'Panetones y productos de temporada navideña' },
    ]);
    
    // Creamos un mapa para encontrar las categorías por nombre fácilmente, es más robusto que usar IDs fijos
    const catMap = new Map(categorias.map(c => [c.nombre, c]));

    // =================================================================
    // PASO 3: INSERTAR LOS PRODUCTOS DE PRUEBA
    // =================================================================
    this.logger.log('Creando productos...');
    await this.productoRepository.save([
      // Mascotas
      { nombre: 'Comida para perro Dog Chow 2kg', precioVenta: 95.00, stockDisponible: 50, categoria: catMap.get('Mascotas') },
      { nombre: 'Arena para gato Mishi 5kg', precioVenta: 55.00, stockDisponible: 30, categoria: catMap.get('Mascotas') },
      
      // Sector Gourmet
      { nombre: 'Queso de cabra madurado 250g', precioVenta: 68.00, stockDisponible: 20, categoria: catMap.get('Sector Gourmet') },
      { nombre: 'Aceite de Oliva Extra Virgen 500ml', precioVenta: 75.00, stockDisponible: 25, categoria: catMap.get('Sector Gourmet') },
      
      // Bebidas Alcohólicas
      { nombre: 'Vino Tinto Aranjuez 750ml', precioVenta: 85.00, stockDisponible: 40, categoria: catMap.get('Bebidas Alcohólicas') },
      { nombre: 'Cerveza Paceña 1L (Pack 6)', precioVenta: 60.00, stockDisponible: 30, categoria: catMap.get('Bebidas Alcohólicas') },
      
      // Panetones
      { nombre: 'Panetón D\'Onofrio Caja 900g', precioVenta: 70.00, stockDisponible: 100, categoria: catMap.get('Panetones') },
      { nombre: 'Panetón Bauducco Frutas 750g', precioVenta: 65.00, stockDisponible: 80, categoria: catMap.get('Panetones') },
    ]);

    this.logger.log('¡Seeding completado exitosamente!');
  }
}