// src/cast/cast.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Cast extends Document {
  @Prop({ required: true })
  nameOfActor: string;

  @Prop({ required: true })
  nameInFilm: string;

  @Prop({ required: true })
  videoId: string;

  @Prop({ required: true })
  avatar: string;
}

export const CastSchema = SchemaFactory.createForClass(Cast);
