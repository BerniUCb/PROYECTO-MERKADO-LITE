export class CreateTicketDto {
  asunto!: string;
  pedidoId!: number;    
  clienteId!: number;   
  agenteId?: number;    
}