export class CreateTicketDto {
  reason!: string;
  orderId!: number;    
  clientId!: number;   
  agentId?: number;    
}