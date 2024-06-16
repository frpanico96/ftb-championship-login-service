import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { encrypt } from './security/auth.security';
import { UserInputDto } from 'src/users/dtos/users.input.dto';
import { UserOutputDto } from 'src/users/dtos/users.output.dto';

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

  async login(user: UserInputDto) {
    const payload = { username: user.username /* sub: user.userId */ };
    const token = await this.jwtService.signAsync(payload);
    return {
      access_token: token,
    };
  }

  async register(user: UserInputDto) {
    try {
      /* Add password regex validation */
      const newUserPayload: UserInputDto = {
        name: user.name,
        username: user.username,
        password: await encrypt(user.password),
      };
      const newUser: UserInputDto =
        await this.usersService.createUser(newUserPayload);
      const tokenPayload = { username: user.username };
      const token = await this.jwtService.signAsync(tokenPayload);
      const outputDto: UserOutputDto = {
        username: newUser.username,
        token: token,
      };
      return outputDto;
    } catch (error) {
      console.log(error);
    }
  }
}
