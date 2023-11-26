import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
// import { Cast } from 'src/database/schemas/cast.schema';
import { Genre } from 'src/database/schemas/genre.schema';
import { Rating } from 'src/database/schemas/rating.schema';
import { Video } from 'src/database/schemas/video.schema';
import { WatchHistory } from 'src/database/schemas/watchHistory.schema';
import { JsonResponse } from 'src/models/admin/list-model/json-response.model';
import { GetHomeDTO } from './dto/getHome.dto';
import { MESSAGES_CODE } from 'src/Constant/status.constants';

@Injectable()
export class HomeService {
  constructor(
    @InjectModel(Video.name)
    private movieModel: mongoose.Model<Video>,
    // @InjectModel(Cast.name)
    // private castModel: mongoose.Model<Cast>,
    @InjectModel(Genre.name)
    private genreModel: mongoose.Model<Genre>,
    @InjectModel(Rating.name)
    private ratingModel: mongoose.Model<Rating>,
    @InjectModel(WatchHistory.name)
    private watchHistoryModel: mongoose.Model<WatchHistory>,
  ) {}
  async GetMovie(userId: any): Promise<any> {
    const jsonResponse = new JsonResponse();
    const getHomeDTO = new GetHomeDTO();
    getHomeDTO.ratingDTOHome = [];
    const rating = await this.ratingModel.aggregate([
      {
        $group: {
          _id: '$videoId',
          averageRating: { $avg: '$value' },
        },
      },
      {
        $sort: { averageRating: -1 },
      },
      {
        $limit: 3,
      },
    ]);
    for (const item of rating) {
      const video = await this.movieModel.findOne({ _id: item._id }).exec();
      const genre = await this.fetchGenres(video.genreId);
      getHomeDTO.ratingDTOHome.push({
        id: item._id,
        genre: genre,
        title: video.title,
        posterImage: video.posterImage,
        averageRating: item.averageRating,
        mpaRatings: item.mpaRatings,
      });
    }
    getHomeDTO.watchingHistoryHome = [];

    const watchingHistory = await this.watchHistoryModel
      .find({ userId: userId })
      .sort({ watchAt: -1 })
      .limit(5)
      .exec();
    for (const item of watchingHistory) {
      const video = await this.movieModel.findOne({ _id: item.videoId }).exec();
      const genre = await this.fetchGenres(video.genreId);
      getHomeDTO.watchingHistoryHome.push({
        id: item._id,
        genre: genre,
        title: video.title,
        posterImage: video.posterImage,
      });
    }
    getHomeDTO.getMovieHomeDTO = [];
    const getMovieTrailers = await this.movieModel
      .find()
      .sort({ additionDate: 1 })
      .limit(3)
      .exec();

    for (const item of getMovieTrailers) {
      const genre = await this.fetchGenres(item.genreId);
      getHomeDTO.getMovieHomeDTO.push({
        id: item._id,
        title: item.title,
        genre: genre,
        movieUrl: item.movieLink,
      });
    }
    jsonResponse.message = MESSAGES_CODE.GET_SUCCESS;
    jsonResponse.success = true;
    jsonResponse.result = getHomeDTO;
    return jsonResponse;
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
      throw new Error('Error fetching Genres');
    }
  }
}
