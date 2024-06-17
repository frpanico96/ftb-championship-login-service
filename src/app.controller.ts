import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { UserLoginDto, UserRegisterDto } from './users/dtos/users.input.dto';
import { UsersService } from './users/users.service';

@Controller({
  path: 'auth',
  version: '1',
})
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    //console.log(req.user);
    const body: UserLoginDto = req.user;
    //console.log(body);
    return this.authService.login(body);
  }

  @Post('register')
  async register(@Request() req) {
    const body: UserRegisterDto = req.body;
    //console.log(body);
    return this.authService.register(body);
  }

  // @Get('all')
  // async getAll() {
  //   return this.userService.getAllUsers();
  // }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    //console.log(req.user);
    return this.userService.getProfile(req.user.id);
  }
}
