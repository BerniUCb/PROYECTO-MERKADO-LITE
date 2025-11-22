import { MovementType, StockMovement } from 'src/entity/stock-movement.entity';
export class CreateStockMovementDto{
    quantity!: number;
    type!: MovementType;
    product_id!: number;
    lot_id?: number;
    user_id?: number;
}