import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockMovement } from 'src/entity/stock-movement.entity';
import { CreateStockMovementDto } from './dto/create-stock.dto';
import { UpdateStockMovementDto } from './dto/update-stock.dto';
import { Product } from 'src/entity/product.entity';
import { Lot } from 'src/entity/lot.entity';
import { User } from 'src/entity/user.entity';
import { QueryHelpers } from 'src/utils/query-helpers';

@Injectable()
export class StockMovementService {
  constructor(
    @InjectRepository(StockMovement)
    private readonly stockMovementRepository: Repository<StockMovement>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Lot)
    private readonly lotRepository: Repository<Lot>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateStockMovementDto): Promise<StockMovement> {
    const product = await this.productRepository.findOne({ where: { id: dto.product_id } });
    if (!product) throw new NotFoundException('Producto no encontrado');

    const lot = dto.lot_id
      ? await this.lotRepository.findOne({ where: { id: dto.lot_id } })
      : null;

    const user = dto.user_id
      ? await this.userRepository.findOne({ where: { id: dto.user_id } })
      : null;

    const movement = this.stockMovementRepository.create({
      quantity: dto.quantity,
      type: dto.type,
      product,
      lot,
      user,
    });

    return await this.stockMovementRepository.save(movement);
  }

  async findAll(
    page?: number,
    limit?: number,
    sort?: string,
    order?: 'asc' | 'desc',
  ): Promise<StockMovement[]> {
    const { page: p, limit: l } = QueryHelpers.normalizePage(page, limit);

    const stockMovements = await this.stockMovementRepository.find({
      relations: ['product', 'lot', 'user'],
      skip: (p - 1) * l,
      take: l,
    });

    return QueryHelpers.orderByProp(stockMovements, sort, order);
  }

  async findOne(id: number): Promise<StockMovement> {
    const movement = await this.stockMovementRepository.findOne({
      where: { id },
      relations: ['product', 'lot', 'user'],
    });

    if (!movement) {
      throw new NotFoundException(`StockMovement con id ${id} no encontrado`);
    }

    return movement;
  }

  async update(id: number, dto: UpdateStockMovementDto): Promise<StockMovement> {
    const movement = await this.findOne(id);

    if (dto.product_id) {
      const product = await this.productRepository.findOne({ where: { id: dto.product_id } });
      if (!product) throw new NotFoundException('Producto no encontrado');
      movement.product = product;
    }

    if (dto.lot_id) {
      const lot = await this.lotRepository.findOne({ where: { id: dto.lot_id } });
      if (!lot) throw new NotFoundException('Lote no encontrado');
      movement.lot = lot;
    }

    if (dto.user_id) {
      const user = await this.userRepository.findOne({ where: { id: dto.user_id } });
      if (!user) throw new NotFoundException('Usuario no encontrado');
      movement.user = user;
    }

    if (dto.quantity !== undefined) movement.quantity = dto.quantity;
    if (dto.type !== undefined) movement.type = dto.type;

    return this.stockMovementRepository.save(movement);
  }

  async remove(id: number): Promise<void> {
    const movement = await this.findOne(id);
    await this.stockMovementRepository.remove(movement);
  }
}