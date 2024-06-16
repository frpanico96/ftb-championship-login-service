import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CustomUser } from './schemas/users.schema';
import { Model } from 'mongoose';

export type User = any; //Todo: add user interface

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(CustomUser.name) private userModel: Model<CustomUser>,
  ) {}

  // Replace with Monoose injection
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    try {
      const user = await this.userModel
        .findOne({ username: username })
        .exec()
        .catch((error) => {
          console.log(error);
          throw new HttpException('Error', HttpStatus.BAD_REQUEST);
        });

      if (!user) {
        throw new HttpException(
          'User not found try registering',
          HttpStatus.NOT_FOUND,
        );
      }

      return user;
    } catch (error) {
      console.log(JSON.stringify(error));
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }

    //this.userModel.findOne({ username: username }).exec();
    //return this.users.find((user) => user.username === username);
  }

  //async createUser()
}
