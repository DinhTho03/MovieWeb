import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { FireBaseService } from '../firebase/fire-base-service/fire-base-service.service';

@Injectable()
export class ModelService<T> {
  constructor(
    @InjectModel(`Video`) private readonly listModel: Model<T>,
    private firebaseService: FireBaseService,
  ) {}

  async findMovie(idList: ObjectId): Promise<any> {
    if (idList === null) {
      return false;
    }
    const video = await this.listModel.findById(idList).exec();
    if (video === null) {
      return false;
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
    const deleteMovie = await this.listModel.findByIdAndDelete(id).exec();
    return deleteMovie;
  }
}
