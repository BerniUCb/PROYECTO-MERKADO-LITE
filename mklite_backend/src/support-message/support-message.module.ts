import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SupportMessage } from "src/entity/support-message.entity";
import { SupportTicket } from "src/entity/support-ticket.entity";
import { User } from "src/entity/user.entity";

import { SupportMessageService } from "./support-message.service";
import { SupportMessageController } from "./support-message.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([SupportMessage, SupportTicket, User])
    ],
    controllers: [SupportMessageController],
    providers: [SupportMessageService],
    exports: [SupportMessageService]
})
export class SupportMessageModule {}
