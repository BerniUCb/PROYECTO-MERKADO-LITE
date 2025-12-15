import {Body,Controller,Delete,Get,Param,Post,Put,} from '@nestjs/common';
import { DriverApplicationService } from './driver-application.service';
import { CreateDriverApplicationDto } from './dto/create-driver-application.dto';
import { UpdateDriverApplicationDto } from './dto/update-driver-application.dto';

@Controller('driver-applications')
export class DriverApplicationController {
  constructor(
    private readonly driverApplicationService: DriverApplicationService,
  ) {}

  @Post()
  create(@Body() dto: CreateDriverApplicationDto) {
    return this.driverApplicationService.create(dto);
  }

  @Get()
  findAll() {
    return this.driverApplicationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.driverApplicationService.findOne(id);
  }

  @Put(':id/status')
  updateStatus(
    @Param('id') id: number,
    @Body() dto: UpdateDriverApplicationDto,
  ) {
    return this.driverApplicationService.updateStatus(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.driverApplicationService.delete(id);
  }
}
