export class UserBaseDto {
  _id?: string;
  username: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserRegisterDto extends UserBaseDto {
  email: string;
  name: string;
  password: string;
}

export class UserLoginDto extends UserBaseDto {
  password: string;
}

export class UserProfileDto extends UserBaseDto {
  email: string;
  name: string;
  isEmailVerified: boolean;
  isChangingEmail: boolean;
}
