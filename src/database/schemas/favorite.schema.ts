// src/favorites/favorites.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Favorites extends Document {
  @Prop({ required: true })
  additionDate: Date;

  @Prop({ type: Types.ObjectId, required: true })
  videoId: string;

  @Prop({ type: Types.ObjectId, required: true })
  userId: string;
}

export const FavoritesSchema = SchemaFactory.createForClass(Favorites);
