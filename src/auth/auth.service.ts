import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { encrypt } from './security/auth.security';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    const token = await this.jwtService.signAsync(payload);
    return {
      access_token: token,
    };
  }

  async register(user: any) {
    try {
      const newUser = {
        username: user.username,
        password: encrypt(user.password),
      };
    } catch (error) {}
  }
}
