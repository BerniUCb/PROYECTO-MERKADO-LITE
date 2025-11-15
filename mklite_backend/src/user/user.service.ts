// src/user/user.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';9
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
// ¡Ya no importamos AppDataSource directamente!

@Injectable()
export class UserService {
  // Inyectamos el Repositorio de User. NestJS y TypeOrmModule se encargan de crearlo
  // y dárnoslo listo para usar.
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(user: User): Promise<User> {
    // Usamos el repositorio para guardar la nueva entidad de usuario.
    const newUser = this.userRepository.create(user); // 'create' prepara el objeto para guardarlo
    return await this.userRepository.save(newUser);
  }

  async getAllUsers(): Promise<User[]> {
    // Usamos el repositorio para encontrar todos los usuarios.
    return await this.userRepository.find();
  }

  async getUserByCi(ci: string): Promise<User> {
    const id = parseInt(ci, 10);
    const user = await this.userRepository.findOneBy({ id }); // Buscamos por la propiedad 'id'

    // Es una buena práctica verificar si el usuario fue encontrado.
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  async deleteUser(ci: string): Promise<{ deleted: boolean; affected?: number }> {
    const id = parseInt(ci, 10);
    const result = await this.userRepository.delete({ id }); // Borramos por la propiedad 'id'

    if (result.affected === 0) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return { deleted: true, affected: result.affected ?? 0 };
  }

  async updateUser(ci: string, userUpdateData: Partial<User>): Promise<User> {
    const id = parseInt(ci, 10);
    // Usamos 'preload' para cargar el usuario existente y fusionar los nuevos datos.
    const userToUpdate = await this.userRepository.preload({
      id: id,
      ...userUpdateData,
    });

    if (!userToUpdate) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    // Guardamos la entidad actualizada.
    return await this.userRepository.save(userToUpdate);
  }
}