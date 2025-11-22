import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { QueryHelpers } from 'src/utils/query-helpers';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Ahora recibe opcionales page, limit, sort y order
  async findAll(
  page?: number,
  limit?: number,
  sort?: string,
  order?: 'asc' | 'desc',
): Promise<User[]> {
  const { page: p, limit: l } = QueryHelpers.normalizePage(page, limit);

  const users = await this.userRepository.find({
    relations: [
      'orders',
      'assignedShipments',
      'cartItems',
      'ratings',
      'stockMovements',
      'addresses',
      'notifications',
    ],
    skip: (p - 1) * l,
    take: l,
  });

  return QueryHelpers.orderByProp(users, sort, order);
}
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['orders', 'enviosAsignados', 'carritoItems', 'calificaciones', 'movimientosStock'],
    });
    if (!user) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    return user;
  }
   async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.userRepository.delete(id);
    if(user.affected ===0){
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
  }
}
