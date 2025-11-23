import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportTicket } from '../entity/support-ticket.entity';
import { Order } from '../entity/order.entity';
import { User } from '../entity/user.entity';
import { SupportMessage } from '../entity/support-message.entity';
//import { TicketService } from './support-ticket.service';
//import { TicketController } from './support-ticket.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([SupportTicket, Order, User, SupportMessage]),
  ],
  //controllers: [TicketController],
  //providers: [TicketService],
  //exports: [TicketService],
})
export class TicketModule {}
