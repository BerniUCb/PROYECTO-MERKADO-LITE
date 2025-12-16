import { DriverApplicationStatus } from 'src/entity/driver-application.entity';

export class UpdateDriverApplicationDto {
  status!: DriverApplicationStatus;
}
