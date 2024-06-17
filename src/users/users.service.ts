/* Service class for User module */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CustomUser, UserDocument } from './schemas/users.schema';
import { Model } from 'mongoose';
import { UserProfileDto, UserRegisterDto } from './dtos/users.input.dto';
import { mapUserToDto } from './utilities/users.utils.query';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(CustomUser.name) private userModel: Model<CustomUser>,
  ) {}

  findOne = async <T>(username: string): Promise<T | undefined> => {
    /* Look for user in the database */
    try {
      const user = await this.userModel.findOne({ username: username }).exec();

      if (!user) {
        throw new NotFoundException('User not found try registering');
      }

      return mapUserToDto<T>(user);
    } catch (error) {
      console.log(JSON.stringify(error));
      throw new NotFoundException(error.message);
    }
  };

  createUser = async (
    userDto: UserRegisterDto,
  ): Promise<UserRegisterDto | undefined> => {
    /* Create a new user */
    try {
      const user = await new this.userModel(userDto).save();
      return mapUserToDto<UserRegisterDto>(user);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  };

  getAllUsers = async (): Promise<UserProfileDto[]> => {
    const users: UserDocument[] = await this.userModel.find().exec();
    const usersProfile: UserProfileDto[] = [];
    for (const signleUser of users) {
      usersProfile.push(mapUserToDto<UserProfileDto>(signleUser));
    }

    return usersProfile;
  };

  getProfile = async (id: string): Promise<UserProfileDto | undefined> => {
    try {
      const user = await this.userModel.findById(id).exec();
      const result: UserProfileDto = mapUserToDto<UserProfileDto>(user);
      return result;
    } catch (error) {
      console.error(error.message);
      throw new NotFoundException(error.message);
    }
  };
}
