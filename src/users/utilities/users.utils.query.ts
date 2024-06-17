import {
  UserLoginDto,
  UserProfileDto,
  UserRegisterDto,
} from '../dtos/users.input.dto';
import { CustomUser } from '../schemas/users.schema';

export const mapUserToLoginDto = (user: CustomUser): UserLoginDto => {
  const result: UserLoginDto = new UserLoginDto();
  result._id = user['_id'];
  result.username = user.username;
  result.password = user.password;
  return result;
};

export const mapUserToProfileDto = (user: CustomUser): UserProfileDto => {
  const result: UserProfileDto = new UserProfileDto();
  result._id = user['_id'];
  result.username = user.username;
  result.email = user.email;
  result.createdAt = user['createdAt'];
  result.updatedAt = user['updatedAt'];
  result.isEmailVerified = user.isEmailVerified;
  return result;
};

export const mapUserToRegisterDto = (user: CustomUser): UserRegisterDto => {
  const result: UserRegisterDto = new UserRegisterDto();
  result._id = user['_id'];
  result.username = user.username;
  return result;
};
