// src/rating/rating.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Rating extends Document {
  @Prop({ type: Types.ObjectId, required: true })
  videoId: string;

  @Prop({ type: Types.ObjectId, required: true })
  userId: string;

  @Prop({ required: true })
  value: number;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);
