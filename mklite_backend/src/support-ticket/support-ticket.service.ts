/*import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { SupportTicket } from '../entity/support-ticket.entity';
import { User } from '../entity/user.entity';
import { Order } from '../entity/order.entity';
import { SupportMessage } from '../entity/support-message.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(SupportTicket)
    private readonly ticketRepo: Repository<SupportTicket>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(SupportMessage)
    private readonly mensajeRepo: Repository<SupportMessage>,
  ) {}

  async create(createDto: CreateTicketDto): Promise<SupportTicket> {
    const user = await this.userRepo.findOne({ where: { id: createDto.clientId }});
    if (!user) throw new NotFoundException(`User with ID ${createDto.clientId} not found`);

    const order = await this.orderRepo.findOne({ where: { id: createDto.orderId }});
    if (!order) throw new NotFoundException(`Order with ID ${createDto.orderId} not found`);
    const newTicket = this.ticketRepo.create({
      subject: createDto.reason, // Asumiendo que reason es el asunto
      status: 'open',
      user: user,
      order: order,
    });
    return await this.ticketRepo.save(newTicket);
  }

  async findAll(): Promise<SupportTicket[]> {
    return await this.ticketRepo.find({
      relations: ['user', 'agent', 'order', 'messages'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<SupportTicket> {
    const t = await this.ticketRepo.findOne({
      where: { id },
      relations: ['user', 'agent', 'order', 'messages'],
    });
    if (!t) throw new NotFoundException(`Ticket with ID ${id} not found`);
    return t;
  }

  async update(id: number, updateDto: UpdateTicketDto): Promise<SupportTicket> {
    const ticket = await this.findOne(id);


    if ((updateDto as any).agentId !== undefined) {
      const agentId = (updateDto as any).agentId;
      if (agentId === null) {
        ticket.agent = null;
      } else {
        const agent = await this.userRepo.findOne({ where: { id: agentId }});
        if (!agent) throw new NotFoundException(`agent ${agentId} not found`);
        ticket.agent = agent;
      }
    }

    if ((updateDto as any).orderId !== undefined) {
      const order = await this.orderRepo.findOne({ where: { id: (updateDto as any).orderId }});
      if (!order) throw new NotFoundException(`Order ${(updateDto as any).orderId} not found`);
      ticket.order = order;
    }


    if (updateDto.reason !== undefined) ticket.subject = updateDto.reason;
    if (updateDto.status !== undefined) ticket.status = updateDto.status as any;

    return await this.ticketRepo.save(ticket);
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const res = await this.ticketRepo.delete({ id });
    if (res.affected === 0) throw new NotFoundException(`Ticket with ID ${id} not found`);
    return { deleted: true };
  }
}*/
