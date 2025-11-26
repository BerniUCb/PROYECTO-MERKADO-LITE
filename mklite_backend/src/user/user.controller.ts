import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ────────────────────────────────────
  // PUBLIC: CREAR USUARIO (signup)
  // ────────────────────────────────────
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  // ────────────────────────────────────
  // PROTEGIDO: OBTENER TODOS LOS USUARIOS
  // ────────────────────────────────────
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

  // ────────────────────────────────────
  // PROTEGIDO: CONTAR USUARIOS REGISTRADOS
  // (IMPORTANTE: DEBE IR ANTES QUE :id )
  // ────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Get('totalUsers')
  async getRegisteredClientsCount(): Promise<{ totalUsers: number }> {
    const count = await this.userService.countUsers();
    return { totalUsers: count };
  }

  // ────────────────────────────────────
  // PROTEGIDO: USUARIOS CON PEDIDOS
  // ────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Get('with-orders')
  async getUsersWithOrders() {
    return this.userService.getUsersWithOrderCount();
  }

  // ────────────────────────────────────
  // PROTEGIDO: CONTAR PEDIDOS DE UN USUARIO
  // (IMPORTANTE: DEBE IR ANTES DE :id)
  // ────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Get(':id/orders/count')
  async getOrdersCount(
    @Param('id') id: number,
  ): Promise<{ totalOrders: number }> {
    const count = await this.userService.countOrdersByUser(id);
    return { totalOrders: count };
  }

  // ────────────────────────────────────
  // PROTEGIDO: UN SOLO USUARIO
  // ────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  // ────────────────────────────────────
  // PROTEGIDO: ACTUALIZAR USUARIO
  // ────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, dto);
  }

  // ────────────────────────────────────
  // PROTEGIDO: ELIMINAR USUARIO
  // ────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.userService.remove(id);
  }
}
