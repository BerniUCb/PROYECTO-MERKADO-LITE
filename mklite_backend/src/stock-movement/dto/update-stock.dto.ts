    import { PartialType } from '@nestjs/mapped-types';
    import { StockMovement } from 'src/entity/stock-movement.entity';
    import { CreateStockMovementDto } from './create-stock.dto';
    export class UpdateStockMovementDto extends PartialType(CreateStockMovementDto){

    }