// src/user/user.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  registrationDate: Date;

  @Prop({ required: true })
  subscription: boolean;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Role' })
  roleId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
