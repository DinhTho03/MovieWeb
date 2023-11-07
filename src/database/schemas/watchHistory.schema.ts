// src/watch-history/watch-history.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class WatchHistory extends Document {
  @Prop({ type: Types.ObjectId, required: true })
  videoId: string;

  @Prop({ required: true })
  watchAt: Date;

  @Prop({ type: Types.ObjectId, required: true })
  userId: string;
}

export const WatchHistorySchema = SchemaFactory.createForClass(WatchHistory);
