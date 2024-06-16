/* Service class for User module */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CustomUser } from './schemas/users.schema';
import { Model } from 'mongoose';
import { UserInputDto, mapToDto } from './dtos/users.input.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(CustomUser.name) private userModel: Model<CustomUser>,
  ) {}

  async findOne(username: string): Promise<UserInputDto | undefined> {
    /* Look for user in the database  */
    try {
      const user: CustomUser = await this.userModel
        .findOne({ username: username })
        .exec();

      if (!user) {
        throw new NotFoundException('User not found try registering');
      }

      return mapToDto(user);
    } catch (error) {
      console.log(JSON.stringify(error));
      throw new NotFoundException(error.message);
    }

    //this.userModel.findOne({ username: username }).exec();
    //return this.users.find((user) => user.username === username);
  }

  async createUser(userDto: UserInputDto): Promise<UserInputDto | undefined> {
    /* Create a new user */
    try {
      const user = await new this.userModel(userDto).save();
      return mapToDto(user);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }
}
