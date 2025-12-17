import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DriverApplication } from 'src/entity/driver-application.entity';
import { User } from 'src/entity/user.entity';

import { CreateDriverApplicationDto } from './dto/create-driver-application.dto';
import { UpdateDriverApplicationDto } from './dto/update-driver-application.dto';

@Injectable()
export class DriverApplicationService {
  constructor(
    @InjectRepository(DriverApplication)
    private readonly driverApplicationRepository: Repository<DriverApplication>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateDriverApplicationDto): Promise<DriverApplication> {
    const user = await this.userRepository.findOneBy({ id: dto.user_id });

    if (!user) {
      throw new NotFoundException(`User with ID ${dto.user_id} not found`);
    }

    const application = this.driverApplicationRepository.create({
      identityCard: dto.identityCard,
      vehicleType: dto.vehicleType,
      user,
    });

    return await this.driverApplicationRepository.save(application);
  }

  async findAll(): Promise<DriverApplication[]> {
    return this.driverApplicationRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<DriverApplication> {
    const application = await this.driverApplicationRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!application) {
      throw new NotFoundException(`Driver Application ID ${id} not found`);
    }

    return application;
  }

  async updateStatus(
    id: number,
    dto: UpdateDriverApplicationDto,
  ): Promise<DriverApplication> {
    const application = await this.driverApplicationRepository.preload({
      id,
      status: dto.status,
    });

    if (!application) {
      throw new NotFoundException(`Driver Application ID ${id} not found`);
    }

    return await this.driverApplicationRepository.save(application);
  }

  async delete(id: number): Promise<{ deleted: boolean }> {
    const result = await this.driverApplicationRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`Driver Application ID ${id} not found`);
    }

    return { deleted: true };
  }
}