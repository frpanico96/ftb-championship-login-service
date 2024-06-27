/* Sevice Class for auth module */
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { encrypt, verifyPass } from './security/auth.security';
import { UserOutputDto } from 'src/users/dtos/users.output.dto';
import {
  UserBaseDto,
  UserLoginDto,
  UserRegisterDto,
} from 'src/users/dtos/users.input.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    /* User validation */
    const user: UserLoginDto = await this.usersService.findOneLogin(username);
    if (!user) return null;
    const passCheck: boolean = await verifyPass(password, user.password);

    if (user && passCheck) {
      return user;
    }
    return null;
  }

  async login(user: UserLoginDto) {
    /* User login and token generation */
    try {
      const token = await this.singJwt(user);
      const result: UserOutputDto = {
        token: token,
      };

      return result;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }
  }

  async register(user: UserRegisterDto) {
    /* User registration and token generation */
    try {
      /* Add password regex validation */
      const newUserPayload: UserRegisterDto = {
        name: user.name,
        username: user.username,
        password: await encrypt(user.password),
        email: user.email,
      };

      const newUser: UserRegisterDto =
        await this.usersService.createUser(newUserPayload);
      const token = await this.singJwt(newUser);
      const outputDto: UserOutputDto = {
        token: token,
      };

      return outputDto;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async singJwt(userPayload: UserBaseDto): Promise<string> {
    //console.log('UserPayload', userPayload);
    const payload = { username: userPayload.username, sub: userPayload._id };
    //console.log('Signing Payload', payload);
    const token: string = await this.jwtService.signAsync(payload);
    return token;
  }
}
