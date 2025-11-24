import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginUserDto } from '../user/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async login(dto: LoginUserDto) {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('El email no está registrado');
    }

    if (user.passwordHash !== dto.password) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    return {
      message: 'Login correcto',
      user,
      token: 'fake-token-123'
    };
  }
}
