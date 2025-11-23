import { Injectable, NotFoundException, BadRequestException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from 'src/entity/rating.entity';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { Order } from 'src/entity/order.entity';
import { User } from 'src/entity/user.entity';
import { QueryHelpers } from 'src/utils/query-helpers';

@Injectable()
export class RatingService {
    constructor(
        @InjectRepository(Rating)
        private readonly ratingRepository: Repository<Rating>,
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ){}
    async create(dto: CreateRatingDto): Promise<Rating>{
        const order = await this.orderRepository.findOne({where:{id: dto.order_id}});
        if(!order) throw new NotFoundException('Pedido (Order) no encontrado');
        const user = await this.userRepository.findOne({where:{id: dto.user_id}});
        if(!order) throw new NotFoundException('User no encontrado');
        //Evitar calificar varias veces al mismo pedido
        const existing = await this.ratingRepository.findOne({where:{order: {id: dto.order_id}}});
        if(!existing) throw new NotFoundException('Este pedido ya ha sido calificado');
    
        const rating = this.ratingRepository.create({
            score: dto.score,
            comment: dto.comment,
            order,
            user,
        });
    return this.ratingRepository.save(rating);
    }
    async findAll(
        page?: number,
        limit?: number,
        sort?: string,
        order?: 'asc' | 'desc',
    ): Promise<Rating[]>{
        const {page: p, limit: l} = QueryHelpers.normalizePage(page, limit);
        const ratings = await this.ratingRepository.find({
            relations: ['order', 'user'],
            skip: (p-1)*l,
            take: l,
        });
        return QueryHelpers.orderByProp(ratings, sort, order);
    }
    async findOne(id: number): Promise<Rating>{
        const rating =await this.ratingRepository.findOne({
            where: {id},
            relations: [ 'order', 'user'],
        });
        if(!rating) throw new NotFoundException('Rating con if $[id] no encontrado');

        return rating;
    }
    async update(id: number, dto: UpdateRatingDto): Promise<Rating>{
        const rating = await this.findOne(id);
        if(dto.order_id){
            const order = await this.orderRepository.findOne({where:{id: dto.order_id}});
            if(!order) throw new NotFoundException('Pedido no encontrado');
            rating.order = order;
        }
        if(dto.user_id){
            const user = await this.userRepository.findOne({where:{id: dto.user_id}});
            if(!user) throw new NotFoundException('Usuario no encontrado');
            rating.user = user;
        }
        if(dto.score !== undefined) rating.score = dto.score;
        if(dto.comment !== undefined) rating.comment = dto.comment;
        return this.ratingRepository.save(rating);
    }
    async remove(id: number): Promise<void>{
        const rating = await this.findOne(id);
        await this.ratingRepository.remove(rating);
    }
}