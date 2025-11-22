import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entity/user.entity';
import { QueryHelpers } from 'src/utils/query-helpers';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('usuarios')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Ahora recibe query params: ?page=1&limit=10&sort=nombre&order=desc
  @Get()
  async getAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sort') sort?: string,
    @Query('order') order?: 'asc' | 'desc',
  ): Promise<User[]> {
    return this.userService.findAll(page, limit, sort, order);
  }

  @Get(':id')
  async getOne(@Param('id') id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.update(id, createUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.userService.remove(id);
  }
}
