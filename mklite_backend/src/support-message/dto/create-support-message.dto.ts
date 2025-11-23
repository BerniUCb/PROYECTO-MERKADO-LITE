import { SupportMessage }  from 'src/entity/support-message.entity';
export class CreateSupportMessageDto {
    content!: string;
    ticket_id!: number;
    sender_id!: number;
}