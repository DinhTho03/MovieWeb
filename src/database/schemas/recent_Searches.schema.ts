// src/recent-searches/recent-searches.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class RecentSearches extends Document {
  @Prop({ type: Types.ObjectId, required: true })
  userId: string;

  @Prop({ required: true })
  title: string;
}

export const RecentSearchesSchema =
  SchemaFactory.createForClass(RecentSearches);
