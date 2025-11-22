import { Module } from '@nestjs/common';
import { TypeOrmModule} from '@nestjs/typeorm';
import { StockMovement } from 'src/entity/stock-movement.entity';
import { Product } from 'src/entity/product.entity';
import { Lot } from 'src/entity/lot.entity';
import { User } from 'src/entity/user.entity';
import { StockMovementService } from './stock-movement.service';
import { StockMovementController } from './stock-movement.controller';

@Module({

    imports:[
    TypeOrmModule.forFeature([StockMovement, Product, Lot, User])
    ],
    controllers:[StockMovementController],
    providers:[StockMovementService],
    exports:[StockMovementService]
})
export class stockMovementModule{}