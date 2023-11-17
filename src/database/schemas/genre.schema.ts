// src/genre/genre.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString } from 'class-validator';
import { Document } from 'mongoose';

@Schema()
export class Genre extends Document {
  @Prop({ required: true })
  @IsString()
  name: string;
}

export const GenreSchema = SchemaFactory.createForClass(Genre);
