import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';

@Injectable()
export class ModelService<T> {
  constructor(@InjectModel(`Video`) private readonly listModel: Model<T>) {}

  async findMovie(idList: ObjectId): Promise<any> {
    if (idList === null) {
      throw new Error('Video not found');
    }
    const video = await this.listModel.findById(idList).exec();
    if (video === null) {
      throw new Error('Video not found');
    }
    return video;
  }

  async deleteMovie(id: ObjectId): Promise<T> {
    if (id === null) {
      throw new Error('Video not found');
    }
    const value = await this.listModel.findById(id).exec();
    if (!value) {
      throw new Error('Video not found');
    }
    return this.listModel.findByIdAndDelete(id).exec();
  }
}
