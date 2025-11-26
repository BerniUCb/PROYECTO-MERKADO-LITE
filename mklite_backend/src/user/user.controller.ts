import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sort') sort?: string,
    @Query('order') order?: 'asc' | 'desc',
  ): Promise<User[]> {
    return this.userService.findAll(page, limit, sort, order);
  }
  @UseGuards(JwtAuthGuard)
  @Get('with-orders')
  async getUsersWithOrders() {
    return this.userService.getUsersWithOrderCount();
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: number): Promise<User> {
    return this.userService.findOne(id);
  }
  
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateUserDto): Promise<User> {
    return this.userService.update(id, dto);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.userService.remove(id);
  }
  @UseGuards(JwtAuthGuard)
  @Get('totalUsers')
  async getRegisteredClientsCount(): Promise<{totalUsers: number}>{
    const count = await this.userService.countUsers();
    return {totalUsers: count};
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id/orders/count')
  async getOrdersCount(@Param('id') id: number): Promise<{ totalOrders: number }> {
    const count = await this.userService.countOrdersByUser(id);
    return { totalOrders: count };
  }


}