import { VehicleType } from 'src/entity/driver-application.entity';

export class CreateDriverApplicationDto {
  identityCard!: string;
  vehicleType!: VehicleType;
  user_id!: number;
}
