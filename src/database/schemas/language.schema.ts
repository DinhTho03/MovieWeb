import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Language extends Document {
  @Prop({ required: true })
  title: string;
}
export const LanguageSchema = SchemaFactory.createForClass(Language);
