import { CustomUser, UserDocument } from '../schemas/users.schema';

export const mapUserToDto = <T>(user: UserDocument): T => {
  const dto = {} as T;
  const plainUser = user.toObject() as CustomUser;

  Object.keys(plainUser).forEach((key) => {
    //console.log(key);
    (dto as any)[key] = user[key];
  });

  return dto;
};
