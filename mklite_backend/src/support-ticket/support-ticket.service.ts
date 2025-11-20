import { Injectable, NotFoundException } from '@nestjs/common';
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
    private readonly OrderRepo: Repository<Order>,
    @InjectRepository(SupportMessage)
    private readonly mensajeRepo: Repository<SupportMessage>,
  ) {}

  async create(createDto: CreateTicketDto): Promise<SupportTicket> {
    const cliente = await this.userRepo.findOne({ where: { id: createDto.clientId }});
    if (!cliente) throw new NotFoundException(`Cliente ${createDto.clientId} not found`);

    const Order = await this.OrderRepo.findOne({ where: { id: createDto.orderId }});
    if (!Order) throw new NotFoundException(`Order ${createDto.orderId} not found`);

    let agent = null;
    if (createDto.agentId) {
      agent = await this.userRepo.findOne({ where: { id: createDto.agentId }});
      if (!agent) throw new NotFoundException(`agent ${createDto.agentId} not found`);
    }

    const ticket = this.ticketRepo.create({
      reason: createDto.reason,
      Order,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: cliente,
      agent,
    } as DeepPartial<SupportTicket>);

    return await this.ticketRepo.save(ticket);
  }

  async findAll(): Promise<SupportTicket[]> {
    return await this.ticketRepo.find({
      relations: ['cliente', 'agent', 'Order', 'mensajes'],
      order: { createdAt : 'DESC' },
    });
  }

  async findOne(id: number): Promise<SupportTicket> {
    const t = await this.ticketRepo.findOne({
      where: { id },
      relations: ['user', 'agent', 'order', 'mensajes'],
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

    if ((updateDto as any).OrderId !== undefined) {
      const order = await this.OrderRepo.findOne({ where: { id: (updateDto as any).orderId }});
      if (!order) throw new NotFoundException(`Order ${(updateDto as any).orderId} not found`);
      ticket.order = order;
    }


    if (updateDto.reason !== undefined) ticket.subject = updateDto.reason;
    if (updateDto !== undefined) ticket.status = updateDto.status as any;

    return await this.ticketRepo.save(ticket);
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const res = await this.ticketRepo.delete({ id });
    if (res.affected === 0) throw new NotFoundException(`Ticket with ID ${id} not found`);
    return { deleted: true };
  }
}
