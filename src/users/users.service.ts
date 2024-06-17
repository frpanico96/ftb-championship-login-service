/* Service class for User module */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CustomUser } from './schemas/users.schema';
import { Model } from 'mongoose';
import {
  UserLoginDto,
  UserProfileDto,
  UserRegisterDto,
} from './dtos/users.input.dto';
import {
  mapUserToLoginDto,
  mapUserToProfileDto,
  mapUserToRegisterDto,
} from './utilities/users.utils.query';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(CustomUser.name) private userModel: Model<CustomUser>,
  ) {}

  findOneLogin = async (
    username: string,
  ): Promise<UserLoginDto | undefined> => {
    /* Look for user in the database */
    try {
      const user = await this.userModel.findOne({ username: username }).exec();

      if (!user) {
        throw new NotFoundException('User not found try registering');
      }

      return mapUserToLoginDto(user);
    } catch (error) {
      console.log(error.message);
      throw new NotFoundException(error.message);
    }
  };

  createUser = async (
    userDto: UserRegisterDto,
  ): Promise<UserRegisterDto | undefined> => {
    /* Create a new user */
    try {
      const user = await new this.userModel(userDto).save();
      return mapUserToRegisterDto(user);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  };

  // getAllUsers = async (): Promise<UserProfileDto[]> => {
  //   const users: UserDocument[] = await this.userModel.find().exec();
  //   const usersProfile: UserProfileDto[] = [];
  //   for (const signleUser of users) {
  //     usersProfile.push(mapUserToDto<UserProfileDto>(signleUser));
  //   }

  //   return usersProfile;
  // };

  getProfile = async (id: string): Promise<UserProfileDto | undefined> => {
    try {
      const user = await this.userModel.findById(id).exec();
      const result: UserProfileDto = mapUserToProfileDto(user);
      return result;
    } catch (error) {
      console.error(error.message);
      throw new NotFoundException(error.message);
    }
  };
}
