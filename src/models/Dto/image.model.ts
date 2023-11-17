import { Prop } from '@nestjs/mongoose';

export class ImageModel {
  @Prop()
  name: string;

  @Prop({ required: true })
  url: string;
}
