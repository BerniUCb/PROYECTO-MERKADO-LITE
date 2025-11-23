import { Inject, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupportMessage } from 'src/entity/support-message.entity';
import { CreateSupportMessageDto } from './dto/create-support-message.dto';
import { UpdateSupportMessageDto } from './dto/update-support-message.dto';
import { SupportTicket } from 'src/entity/support-ticket.entity';
import { User } from 'src/entity/user.entity';
import { QueryHelpers } from 'src/utils/query-helpers';

@Injectable()
export class SupportMessageService {
    constructor(
        @InjectRepository(SupportMessage)
        private readonly supportMessageRepository: Repository<SupportMessage>,
        @InjectRepository(SupportTicket)
        private readonly supportTicketRepository: Repository<SupportTicket>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ){}
    async create(dto: CreateSupportMessageDto): Promise<SupportMessage>{
        const ticket = await this.supportTicketRepository.findOne({where: {id: dto.ticket_id}});
        if(!ticket) throw new NotFoundException(`Support Ticket con id ${dto.ticket_id} not found`);
         const sender = await this.userRepository.findOne({where:{id: dto.sender_id}});
        if(!sender) throw new NotFoundException('Usuario no encontrado');
        const message = this.supportMessageRepository.create({
            content: dto.content,
            ticket,
            sender,
        });
        return this.supportMessageRepository.save(message);
    }
    async findAll(
        page?: number,
        limit?: number,
        sort?: string,
        order?: "asc" | "desc",
    ): Promise<SupportMessage[]> {
        const {page: p, limit: l} = QueryHelpers.normalizePage(page, limit);
        const messages = await this.supportMessageRepository.find({
            relations: ["ticket", "sender"],
            skip: (p-1)*l,
            take: l
        });
        return QueryHelpers.orderByProp(messages, sort, order);
    }
    async finOne(id: number): Promise<SupportMessage>{
        const message = await this.supportMessageRepository.findOne({
            where: {id},
            relations: ["ticket", "sender"]
        });
        if(!message) throw new NotFoundException('Support message con id ${id} no encontrado');
        return message;
    }
    async update(id: number, dto: UpdateSupportMessageDto): Promise<SupportMessage>{
        const message = await this.finOne(id);
        if (dto.ticket_id) {
            const ticket = await this.supportTicketRepository.findOne({
                where: { id: dto.ticket_id }
            });
            if (!ticket) throw new NotFoundException("Support ticket not found");
            message.ticket = ticket;
        }
        if(dto.sender_id){
            const sender = await this.userRepository.findOne({
                where: {id: dto.sender_id}
            });
            if(!sender) throw new NotFoundException("Sender no encontrado");
            message.sender = sender;
        }
        Object.assign(message, dto);
        return this.supportMessageRepository.save(message);
    }
    async remove(id: number): Promise<void>{
        const message = await this.finOne(id);
        await this.supportMessageRepository.remove(message);
    }
}