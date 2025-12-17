// src/notification/notification.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, RecipientRole, NotificationType } from '../entity/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto'; 
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  // ------------------------------------------------------------------
  // 📚 CRUD BÁSICO
  // ------------------------------------------------------------------

  /** * @method create 
   * Crea una nueva notificación. 
   */
  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
  // Desestructuramos para separar userId del resto de los datos
    const { userId, ...data } = createNotificationDto;

    const notification = this.notificationRepository.create({
      ...data,
      // Creamos el objeto de relación solo si userId existe
      user: userId ? { id: userId } : null 
  });

  return this.notificationRepository.save(notification);
}

  /** * @method findAll 
   * Obtiene todas las notificaciones. 
   */
  async findAll(): Promise<Notification[]> {
    return this.notificationRepository.find({ relations: ['user'] });
  }

  /** * @method findOne 
   * Obtiene una notificación por su ID. 
   */
  async findOne(id: number): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found.`);
    }
    return notification;
  }

  /** * @method update 
   * Actualiza una notificación existente. 
   */
  async update(id: number, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
    // Verificar que la notificación exista
    await this.findOne(id); 

    await this.notificationRepository.update(id, updateNotificationDto);
    return this.findOne(id); // Retornar la entidad actualizada
  }

  /** * @method remove 
   * Elimina una notificación por su ID. 
   */
  async remove(id: number): Promise<void> {
    const result = await this.notificationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Notification with ID ${id} not found.`);
    }
  }
  
  // ------------------------------------------------------------------
  // ✨ MÉTODOS ADICIONALES
  // ------------------------------------------------------------------

  /** * @method findUnreadByRecipient 
   * Obtiene notificaciones no leídas para un rol de destinatario específico. 
   */
  async findUnreadByRecipient(role: RecipientRole): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { recipientRole: role, isRead: false },
      order: { createdAt: 'DESC' },
    });
  }

  /** * @method findByUserId 
   * Obtiene todas las notificaciones para un usuario específico (personales). 
   */
  async findByUserId(userId: number): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  /** * @method markAsRead 
   * Marca una notificación específica como leída. 
   */
  async markAsRead(id: number): Promise<Notification> {
    const notification = await this.findOne(id);
    if (!notification.isRead) {
      notification.isRead = true;
      return this.notificationRepository.save(notification);
    }
    return notification;
  }
  // todas las notis ya sea de solo admins o solo clientes
  async findAllByRole(role: RecipientRole): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { recipientRole: role }, // Solo filtra por rol
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByType(type: NotificationType): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { type }, // Filtra directamente por el campo 'type'
      order: { createdAt: 'DESC' },
    });
  }
}

