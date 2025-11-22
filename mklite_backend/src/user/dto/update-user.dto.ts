import { User } from 'src/entity/user.entity';
export class UpdateUserDto {
  fullName?: string;
  email?: string;
  password?: string;
  role?: 'Admin' | 'Seller' | 'Warehouse' | 'DeliveryDriver' | 'Client' | 'Support' | 'Supplier';
  isActive?: boolean;

  isTwoFactorEnabled?: boolean;
}
