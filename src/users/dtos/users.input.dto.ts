import { CustomUser } from '../schemas/users.schema';

export class UserInputDto {
  name: string;
  username: string;
  password: string;
}

export const mapToDto = (user: CustomUser): UserInputDto => {
  const userDto: UserInputDto = {
    name: user.name,
    username: user.username,
    password: user.password,
  };
  return userDto;
};
