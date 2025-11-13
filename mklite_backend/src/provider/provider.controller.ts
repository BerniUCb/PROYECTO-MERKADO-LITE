import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Proveedor } from 'src/entity/provider.entity';
import { ProviderService } from './provider.service';

@Controller('/provider')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @Post()
  createProvider(@Body() proveedor: Proveedor) {
    return this.providerService.createProvider(proveedor);
  }

  @Get()
  getAllProviders() {
    return this.providerService.getAllProviders();
  }

  @Get('/:id')
  getProviderById(@Param('id') id: number) {
    return this.providerService.getProviderById(id);
  }

  @Delete('/:id')
  deleteProvider(@Param('id') id: number) {
    return this.providerService.deleteProvider(id);
  }

  @Put('/:id')
  updateProvider(@Param('id') id: number, @Body() proveedor: Proveedor) {
    return this.providerService.updateProvider(id, proveedor);
  }
}
