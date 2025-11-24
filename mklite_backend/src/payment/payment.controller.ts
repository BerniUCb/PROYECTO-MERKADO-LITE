import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('/payment')
export class PaymentController {

  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  createPayment(@Body() dto: CreatePaymentDto) {
    return this.paymentService.createPayment(dto);
  }

  @Get()
  getAllPayments() {
    return this.paymentService.getAllPayments();
  }

  @Get('/:id')
  getPaymentById(@Param('id') id: number) {
    return this.paymentService.getPaymentById(id);
  }

  @Put('/:id')
  updatePayment(@Param('id') id: number, @Body() dto: UpdatePaymentDto) {
    return this.paymentService.updatePayment(id, dto);
  }

  @Delete('/:id')
  deletePayment(@Param('id') id: number) {
    return this.paymentService.deletePayment(id);
  }
}
