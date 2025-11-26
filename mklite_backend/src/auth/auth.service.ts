import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { identity } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ){}

  async validateUser(email: string, password: string): Promise<any>{
    const user = await this.userService.findByEmail(email);
    if(!user) throw new UnauthorizedException('Usuario no encontrado');
    

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if(!passwordMatch) throw new UnauthorizedException('Contraseña incorrecta');

    return user;
  }

  async login(user: User){
    const payload = { sub}
  }
}