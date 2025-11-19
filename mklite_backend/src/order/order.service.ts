import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from 'src/entity/order.entity';

@Injectable()
export class PedidoService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
  ) {}

  async create(data: Partial<Pedido>): Promise<Pedido> {
    const pedido = this.pedidoRepository.create(data);
    return await this.pedidoRepository.save(pedido);
  }

  async findAll(): Promise<Pedido[]> {
    return await this.pedidoRepository.find({ relations: ['cliente'] });
  }

  async findOne(id: number): Promise<Pedido> {
    const pedido = await this.pedidoRepository.findOne({
      where: { id },
      relations: ['cliente'],
    });

    if (!pedido) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }
    return pedido;
  }

  async update(id: number, data: any): Promise<Pedido> {
    const pedido = await this.findOne(id);
    Object.assign(pedido, data);
    return await this.pedidoRepository.save(pedido);
  }

  async remove(id: number): Promise<void> {
    const result = await this.pedidoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }
  }
}
