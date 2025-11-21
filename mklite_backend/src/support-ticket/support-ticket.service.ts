import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    private readonly pedidoRepo: Repository<Order>,
    @InjectRepository(SupportMessage)
    private readonly mensajeRepo: Repository<SupportMessage>,
  ) {}
/*
  async create(createDto: CreateTicketDto): Promise<SupportTicket> {
    const cliente = await this.userRepo.findOne({ where: { id: createDto.clienteId }});
    if (!cliente) throw new NotFoundException(`Cliente ${createDto.clienteId} not found`);

    const pedido = await this.pedidoRepo.findOne({ where: { id: createDto.pedidoId }});
    if (!pedido) throw new NotFoundException(`Pedido ${createDto.pedidoId} not found`);

    let agente = null;
    if (createDto.agenteId) {
      agente = await this.userRepo.findOne({ where: { id: createDto.agenteId }});
      if (!agente) throw new NotFoundException(`Agente ${createDto.agenteId} not found`);
    }

    const ticket = this.ticketRepo.create({
      subject: createDto.asunto,
      cliente,
      pedido,
      agente,
    });

    return await this.ticketRepo.save(ticket);
  }*/

  async findAll(): Promise<SupportTicket[]> {
    return await this.ticketRepo.find({
      relations: ['cliente', 'agente', 'pedido', 'mensajes'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<SupportTicket> {
    const t = await this.ticketRepo.findOne({
      where: { id },
      relations: ['cliente', 'agente', 'pedido', 'mensajes'],
    });
    if (!t) throw new NotFoundException(`Ticket with ID ${id} not found`);
    return t;
  }

  async update(id: number, updateDto: UpdateTicketDto): Promise<SupportTicket> {
    const ticket = await this.findOne(id);


    if ((updateDto as any).agenteId !== undefined) {
      const agenteId = (updateDto as any).agenteId;
      if (agenteId === null) {
        ticket.agent = null;
      } else {
        const agente = await this.userRepo.findOne({ where: { id: agenteId }});
        if (!agente) throw new NotFoundException(`Agente ${agenteId} not found`);
        ticket.agent = agente;
      }
    }

    if ((updateDto as any).pedidoId !== undefined) {
      const pedido = await this.pedidoRepo.findOne({ where: { id: (updateDto as any).pedidoId }});
      if (!pedido) throw new NotFoundException(`Pedido ${(updateDto as any).pedidoId} not found`);
      ticket.order = pedido;
    }


    if (updateDto.asunto !== undefined) ticket.subject = updateDto.asunto;
    if (updateDto.estado !== undefined) ticket.status = updateDto.estado as any;

    return await this.ticketRepo.save(ticket);
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const res = await this.ticketRepo.delete({ id });
    if (res.affected === 0) throw new NotFoundException(`Ticket with ID ${id} not found`);
    return { deleted: true };
  }
}
