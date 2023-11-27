import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { MESSAGES_CODE } from 'src/Constant/status.constants';
// import { Cast } from 'src/database/schemas/cast.schema';
import { Genre } from 'src/database/schemas/genre.schema';
import { Video } from 'src/database/schemas/video.schema';
import { JsonResponse } from 'src/models/admin/list-model/json-response.model';
import { VideoPlayDTO } from './dto/videoplay.dto';
import { WatchHistory } from 'src/database/schemas/watchHistory.schema';
import { Favorites } from 'src/database/schemas/favorite.schema';
import { Rating } from 'src/database/schemas/rating.schema';

@Injectable()
export class VideoplayService {
  constructor(
    @InjectModel(Video.name)
    private movieModel: mongoose.Model<Video>,
    // @InjectModel(Cast.name)
    // private castModel: mongoose.Model<Cast>,
    @InjectModel(Genre.name)
    private genreModel: mongoose.Model<Genre>,
    @InjectModel(WatchHistory.name)
    private watchHistoryModel: mongoose.Model<WatchHistory>,
    @InjectModel(Favorites.name)
    private favoritesModel: mongoose.Model<Favorites>,
    @InjectModel(Rating.name)
    private ratingModel: mongoose.Model<Rating>,
  ) {}
  async getVideoPlay(id: string, userId: any): Promise<any> {
    const jsonResponse = new JsonResponse();
    if (!id) {
      jsonResponse.success = false;
      jsonResponse.message = MESSAGES_CODE.GET_FAIL;
      jsonResponse.result = 'Id is required';
      return jsonResponse;
    }
    const videoPlay = await this.movieModel.findOne({ _id: id }).exec();
    videoPlay.view += 1;
    await videoPlay.save();
    if (!videoPlay) {
      jsonResponse.success = false;
      jsonResponse.message = MESSAGES_CODE.GET_FAIL;
      jsonResponse.result = 'Video not found';
      return jsonResponse;
    }
    // const cast = await this.fetchCast(videoPlay.castId);
    const genre = await this.fetchGenres(videoPlay.genreId);
    const dataVideo: VideoPlayDTO = {
      id: videoPlay._id,
      title: videoPlay.title,
      movieLink: videoPlay.movieLink,
      mpaRatings: videoPlay.mpaRatings,
      content: videoPlay.content,
      // cast: cast,
      genre: genre,
    };
    const watchHistoryFilter = await this.watchHistoryModel
      .findOne({ videoId: id, userId: userId })
      .exec();
    if (watchHistoryFilter) {
      watchHistoryFilter.watchAt = new Date();
      await watchHistoryFilter.save();
    } else {
      const watchHistory = new this.watchHistoryModel();
      watchHistory.videoId = id;
      watchHistory.userId = userId;
      watchHistory.watchAt = new Date();
      await watchHistory.save();
    }

    jsonResponse.success = true;
    jsonResponse.message = MESSAGES_CODE.GET_SUCCESS;
    jsonResponse.result = dataVideo;
    return jsonResponse;
  }

  // private async fetchCast(cast: string[]): Promise<Cast[]> {
  //   // Assume that you have a "Favorites" model/schema defined in your application
  //   // and a corresponding collection in MongoDB
  //   try {
  //     const listcast: Cast[] = [];
  //     // Assuming you have a GenreModel or a similar model
  //     for (const models of cast) {
  //       const casts = await this.castModel.findById({ _id: models }).exec();
  //       listcast.push(casts);
  //     }
  //     return listcast;

  //     // Map the genre data to the desired format
  //   } catch (error) {
  //     // Handle any errors that might occur during the database query
  //     throw new Error('Error fetching favorites');
  //   }
  // }

  async likeVideoPlay(
    videoId: string,
    userId: string,
    like: boolean,
  ): Promise<any> {
    console.log(like);

    try {
      if (like) {
        // Nếu người dùng thích video
        const videoPlay = new this.favoritesModel({
          videoId: videoId,
          userId: userId,
          additionDate: new Date(),
        });
        console.log(1);
        await videoPlay.save();
        return videoPlay;
      } else {
        // Nếu người dùng không thích video nữa
        console.log(2);
        const videoPlay = await this.favoritesModel
          .findOneAndDelete({ videoId: videoId, userId: userId })
          .exec();

        if (videoPlay) {
          return videoPlay;
        } else {
          console.log('Video not found in favorites.');
          return null;
        }
      }
    } catch (error) {
      console.error('Error in likeVideoPlay:', error.message);
      throw error;
    }
  }

  async ratingVideoPlay(
    videoId: string,
    userId: string,
    rate: number,
  ): Promise<any> {
    try {
      // Nếu người dùng thích video
      const existRating = await this.ratingModel
        .findOne({ videoId: videoId, userId: userId })
        .exec();
      if (!existRating) {
        const rating = new this.ratingModel({
          videoId: videoId,
          userId: userId,
          value: rate,
        });
        await rating.save();
        return rating;
      } else {
        existRating.value = rate;
        await existRating.save();
        return existRating;
      }
    } catch (error) {
      console.error('Error in likeVideoPlay:', error.message);
      throw error;
    }
  }

  private async fetchGenres(genre: string[]): Promise<Genre[]> {
    // Assume that you have a "Favorites" model/schema defined in your application
    // and a corresponding collection in MongoDB
    try {
      const listGenre: Genre[] = [];
      // Assuming you have a GenreModel or a similar model
      for (const models of genre) {
        const genres = await this.genreModel.findById({ _id: models }).exec();
        listGenre.push(genres);
      }
      return listGenre;

      // Map the genre data to the desired format
    } catch (error) {
      // Handle any errors that might occur during the database query
      throw new Error('Error fetching favorites');
    }
  }
}
