import { User } from 'src/entity/user.entity';
import { UserRole } from 'src/entity/user.entity';
export class CreateUserDto{
    fullName!: string;
    email!: string;
    password!: string; 
    role!: UserRole;
}