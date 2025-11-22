import { User } from 'src/entity/user.entity';
import { UserRole } from 'src/entity/user.entity';
export class CreateUserDto{
    fullname!: string;
    email!: string;
    password!: string; 
    role!: UserRole;
}