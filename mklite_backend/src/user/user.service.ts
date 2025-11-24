import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryHelpers } from 'src/utils/query-helpers';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}


  async findAll(
    page?: number,
    limit?: number,
    sort?: string,
    order?: 'asc' | 'desc',
  ): Promise<User[]> {

    const { page: p, limit: l } = QueryHelpers.normalizePage(page, limit);

    // Validación de campos permitidos para order
    const validSortFields = ['id', 'fullName', 'email', 'role', 'createdAt'];
    if (sort && !validSortFields.includes(sort)) {
      throw new BadRequestException(`Campo de ordenamiento no válido: ${sort}`);
    }

    return await this.userRepository.find({
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
      order: sort ? { [sort]: order ?? 'asc' } : undefined,
    });
  }


  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: [
        'orders',
        'assignedShipments',
        'cartItems',
        'ratings',
        'stockMovements',
        'addresses',
        'notifications',
      ],
    });

    if (!user) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    return user;
  }


  async create(dto: CreateUserDto): Promise<User> {
    // Validación de email duplicado
    const exists = await this.userRepository.findOne({ where: { email: dto.email }});
    if (exists) throw new BadRequestException('El email ya está registrado');

    const user = this.userRepository.create({
      fullName: dto.fullName,
      email: dto.email,
      passwordHash: dto.password, // Aquí luego aplicas bcrypt
      role: dto.role,
    });

    return await this.userRepository.save(user);
  }


  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    Object.assign(user, {
      ...dto,
      passwordHash:
        dto.password && dto.password.trim() !== ''
          ? dto.password // Aquí luego aplicas bcrypt
          : user.passwordHash,
    });

    return await this.userRepository.save(user);
  }


  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
  }
  async countUsers(): Promise<number>{
    return this.userRepository.count();
  }
  async findByEmail(email: string) {
  return this.userRepository.findOne({
    where: { email },
    select: ['id', 'email', 'fullName', 'role', 'isActive', 'passwordHash']
  });
}

}