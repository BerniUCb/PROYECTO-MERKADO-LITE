import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DriverApplication } from 'src/entity/driver-application.entity';
import { User } from 'src/entity/user.entity';

import { DriverApplicationService } from './driver-application.service';
import { DriverApplicationController } from './driver-application.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DriverApplication, User])],
  controllers: [DriverApplicationController],
  providers: [DriverApplicationService],
})
export class DriverApplicationModule {}