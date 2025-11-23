import { User, UserRole } from 'src/entity/user.entity';
export class UpdateUserDto {
  fullName?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  isActive?: boolean;

  isTwoFactorEnabled?: boolean;
}
