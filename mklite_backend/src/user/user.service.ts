import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { QueryHelpers } from 'src/utils/query-helpers';

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
      relations: ['pedidos', 'enviosAsignados', 'carritoItems', 'calificaciones', 'movimientosStock'],
      skip: (p - 1) * l,
      take: l,
    });

    // Ordenamiento usando utilitario
    return QueryHelpers.orderByProp(users, sort, order);
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['pedidos', 'enviosAsignados', 'carritoItems', 'calificaciones', 'movimientosStock'],
    });
    if (!user) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    return user;
  }

  async create(data: Partial<User>): Promise<User> {
    const user = this.userRepository.create(data);
    return await this.userRepository.save(user);
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, data);
    return await this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}
