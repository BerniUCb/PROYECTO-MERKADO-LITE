import { MaxFileSizeValidator } from '@nestjs/common';
import { Rating } from 'src/entity/rating.entity'
export class CreateRatingDto{
    score!: number;
    comment?: string;

    order_id!: number;
    user_id!: number;

}