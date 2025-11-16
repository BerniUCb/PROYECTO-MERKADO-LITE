import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TicketSoporte } from '../entity/support-ticket.entity';
import { User } from '../entity/user.entity';
import { Pedido } from '../entity/order.entity';
import { MensajeSoporte } from '../entity/support-message.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(TicketSoporte)
    private readonly ticketRepo: Repository<TicketSoporte>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Pedido)
    private readonly pedidoRepo: Repository<Pedido>,
    @InjectRepository(MensajeSoporte)
    private readonly mensajeRepo: Repository<MensajeSoporte>,
  ) {}

  async create(createDto: CreateTicketDto): Promise<TicketSoporte> {
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
      asunto: createDto.asunto,
      cliente,
      pedido,
      agente,
    });

    return await this.ticketRepo.save(ticket);
  }

  async findAll(): Promise<TicketSoporte[]> {
    return await this.ticketRepo.find({
      relations: ['cliente', 'agente', 'pedido', 'mensajes'],
      order: { fechaCreacion: 'DESC' },
    });
  }

  async findOne(id: number): Promise<TicketSoporte> {
    const t = await this.ticketRepo.findOne({
      where: { id },
      relations: ['cliente', 'agente', 'pedido', 'mensajes'],
    });
    if (!t) throw new NotFoundException(`Ticket with ID ${id} not found`);
    return t;
  }

  async update(id: number, updateDto: UpdateTicketDto): Promise<TicketSoporte> {
    const ticket = await this.findOne(id);

    // Si viene agenteId en el update, resolver a entidad
    if ((updateDto as any).agenteId !== undefined) {
      const agenteId = (updateDto as any).agenteId;
      if (agenteId === null) {
        ticket.agente = null;
      } else {
        const agente = await this.userRepo.findOne({ where: { id: agenteId }});
        if (!agente) throw new NotFoundException(`Agente ${agenteId} not found`);
        ticket.agente = agente;
      }
    }

    // si viene pedidoId
    if ((updateDto as any).pedidoId !== undefined) {
      const pedido = await this.pedidoRepo.findOne({ where: { id: (updateDto as any).pedidoId }});
      if (!pedido) throw new NotFoundException(`Pedido ${(updateDto as any).pedidoId} not found`);
      ticket.pedido = pedido;
    }

    // campos directos
    if (updateDto.asunto !== undefined) ticket.asunto = updateDto.asunto;
    if (updateDto.estado !== undefined) ticket.estado = updateDto.estado as any;

    return await this.ticketRepo.save(ticket);
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const res = await this.ticketRepo.delete({ id });
    if (res.affected === 0) throw new NotFoundException(`Ticket with ID ${id} not found`);
    return { deleted: true };
  }
}
