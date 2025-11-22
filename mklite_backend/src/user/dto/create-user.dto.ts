import { User } from 'src/entity/user.entity';
export class CreateUserDto{
    fullname!: string;
    email!: string;
    password!: string; 
    role!: 'Admin' | 'Seller' | 'Warehouse' | 'DeliveryDriver' | 'Client' | 'Support' | 'Supplier';
}