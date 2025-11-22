import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockMovement } from 'src/entity/stock-movement.entity';
import { CreateStockMovementDto } from './dto/create-stock.dto';
import { UpdateStockMovementDto } from './dto/update-stock.dto';
import { QueryHelpers } from 'src/utils/query-helpers';

@Injectable()
export class StockMovementService {
    constructor(
        @InjectRepository(StockMovement)
        private readonly stockMovementRepository: Repository<StockMovement>,
    ){}
    async create(createStockMovDto: CreateStockMovementDto): Promise<StockMovement>{
        const stockMovement = this.stockMovementRepository.create({
            quantity: createStockMovDto.queantity,
            type: createStockMovDto.type,
            product: {id: createStockMovDto.product_id},
            lot: createStockMovDto.lot_id? {id: createStockMovDto.lot_id}: null,
            user: createStockMovDto.user_id? {id: createStockMovDto.user_id}: null,
        });
        return await this.stockMovementRepository.save(stockMovement);
    }
    async findAll(
        page?: number,
        limit?:
        number,
        sort?:
        string,
        order?: 'asc'|'desc',
    ): Promise<StockMovement[]>{
       const{ page: p, limit: l} = QueryHelpers.normalizePage(page, limit);
       const stockMovements = await this.stockMovementRepository.find({
        relations: ['product', 'lot', 'user'],
        skip: (p- 1)*l,
        take:l,
       });
       return QueryHelpers.orderByProp(stockMovements, sort, order);
    }
    
}