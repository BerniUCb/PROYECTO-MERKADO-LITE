import { VehicleType } from "../../models/driverApplication.model";

export interface CreateDriverApplicationDto {
  identityCard: string;
  vehicleType: VehicleType;
  user_id: number;
}
