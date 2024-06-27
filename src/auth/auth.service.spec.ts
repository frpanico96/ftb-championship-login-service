import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as authSecurity from './security/auth.security';
import { UserLoginDto, UserRegisterDto } from '../users/dtos/users.input.dto';
import { UserOutputDto } from 'src/users/dtos/users.output.dto';
import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneLogin: jest.fn(),
            createUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get(UsersService);
    jwtService = module.get(JwtService);

    jest
      .spyOn(authSecurity, 'verifyPass')
      .mockImplementation(() => Promise.resolve(true));
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      const mockUser = { username: 'test', password: 'hashedpassword' };
      userService.findOneLogin.mockResolvedValue(mockUser);
      //(authSecurity.verifyPass as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateUser('test', 'password');
      expect(result).toEqual(mockUser);
    });

    it('should return null if credentials are valid', async () => {
      const mockUser = { username: 'test', password: 'hashedpassword' };
      userService.findOneLogin.mockResolvedValue(mockUser);
      (authSecurity.verifyPass as jest.Mock).mockResolvedValue(false);

      const result = await authService.validateUser('test', 'password');
      expect(result).toBeNull();
    });

    it('should return null if user is not found', async () => {
      userService.findOneLogin.mockResolvedValue(null);

      const result = await authService.validateUser('test', 'password');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return token if login is succesfull', async () => {
      const mockUser: UserLoginDto = {
        _id: '1',
        username: 'test',
        password: 'pass',
      };
      const mockToken: UserOutputDto = {
        token: 'token',
      };
      jwtService.signAsync.mockResolvedValue(mockToken.token);

      const result = await authService.login(mockUser);
      expect(result).toEqual(mockToken);
    });

    it('should throw unauthorized exception if login is not succesfull', async () => {
      const mockUser: UserLoginDto = {
        _id: '1',
        username: 'test',
        password: 'pass',
      };
      jest.spyOn(authService, 'singJwt').mockRejectedValue(new Error());
      await expect(authService.login(mockUser)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('register', () => {
    it('should return a token after succesfull registration', async () => {
      const mockUser: UserRegisterDto = {
        name: 'test',
        username: 'test',
        email: 'email',
        password: 'pass',
      };
      const mockToken: UserOutputDto = {
        token: 'token',
      };
      userService.createUser.mockResolvedValue(mockUser);
      jest.spyOn(authService, 'singJwt').mockResolvedValue(mockToken.token);

      const result = await authService.register(mockUser);
      expect(result).toEqual(mockToken);
    });

    it('should throw an exception if registration fails', async () => {
      const mockUser: UserRegisterDto = {
        name: 'test',
        username: 'test',
        email: 'email',
        password: 'pass',
      };
      userService.createUser.mockRejectedValue(new Error());

      await expect(authService.register(mockUser)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
