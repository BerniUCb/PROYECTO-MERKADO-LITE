import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entity/user.entity';

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
  async create(@Body() body: Partial<User>): Promise<User> {
    return this.userService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() body: Partial<User>): Promise<User> {
    return this.userService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.userService.remove(id);
  }
}
