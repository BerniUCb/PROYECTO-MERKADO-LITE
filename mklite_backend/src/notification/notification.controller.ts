// src/notification/notification.controller.ts

import {Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode,Query,ParseIntPipe, BadRequestException,} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { RecipientRole, NotificationType } from '../entity/notification.entity';

@Controller('notifications') // Se mantiene en plural en la URL por convención REST
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // ------------------------------------------------------------------
  // 📚 RUTAS CRUD BÁSICO
  // ------------------------------------------------------------------

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Get()
  findAll() {
    return this.notificationService.findAll();
  }

 
  // ------------------------------------------------------------------
  // ✨ RUTAS ADICIONALES
  // ------------------------------------------------------------------
  
  /**
   * Obtiene notificaciones no leídas filtradas por rol.
   * E.g.: GET /notifications/unread?role=Admin
   */
  @Get('unread-by-role')
  findUnreadByRecipient(@Query('role') role: RecipientRole) {
    // Se recomienda añadir validación para el parámetro 'role'
    return this.notificationService.findUnreadByRecipient(role);
  }

  /**
   * Obtiene todas las notificaciones de un usuario específico.
   * E.g.: GET /notifications/user/123
   */
  @Get('user/:userId')
  findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.notificationService.findByUserId(userId);
  }
  
  /**
   * Marca una notificación específica como leída.
   * E.g.: PATCH /notifications/123/read
   */
  @Patch(':id/read')
  markAsRead(@Param('id', ParseIntPipe) id: number) {
    return this.notificationService.markAsRead(id);
  }

  @Get('by-type') // <-- Nueva ruta
  findByType(@Query('type') type: NotificationType) {
    if (!type) {
        throw new BadRequestException('El parámetro de consulta "type" (NotificationType) es requerido.');
    }
    return this.notificationService.findByType(type);
  }


  //FUNADAS PQ PRIORIDAD DE OTROS ENDPOINTS
   @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.notificationService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationService.update(id, updateNotificationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.notificationService.remove(id);
  }
  
}