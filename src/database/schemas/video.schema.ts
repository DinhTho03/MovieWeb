import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Video extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ type: Date }) // Sử dụng kiểu dữ liệu Date cho ReleaseYear
  releaseYear: Date;

  @Prop({ required: true })
  duration: number;

  @Prop({ required: true })
  posterImage: string;

  @Prop({ required: true })
  movieLink: string;

  @Prop({ required: true })
  view: number;

  @Prop({ required: true })
  mpaRatings: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  additionDate: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Cast' }], required: true })
  castId: string[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Genre' }], required: true })
  genreId: string[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Language' }], required: true })
  languageId: string[];
}

export const VideoSchema = SchemaFactory.createForClass(Video);
