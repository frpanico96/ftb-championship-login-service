import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<CustomUser>;

@Schema({ collection: 'users', timestamps: true })
export class CustomUser {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ default: false })
  isChangingEmail: boolean;
}

export const UserSchema = SchemaFactory.createForClass(CustomUser);
