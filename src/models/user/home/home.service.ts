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
import { Favorites } from 'src/database/schemas/favorite.schema';

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
    @InjectModel(Favorites.name)
    private favoritesModel: mongoose.Model<Favorites>,
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
        $limit: 10,
      },
    ]);
    console.log(rating);
    for (const item of rating) {
      const video = await this.movieModel.findOne({ _id: item._id }).exec();
      const genre = await this.fetchGenres(video.genreId);
      const favoritesCount = await this.favoritesModel.countDocuments({
        videoId: item._id,
      });
      getHomeDTO.ratingDTOHome.push({
        id: item._id,
        genre: genre,
        title: video.title,
        posterImage: video.posterImage,
        averageRating: item.averageRating,
        mpaRatings: item.mpaRatings,
        favorite: favoritesCount,
      });
    }
    getHomeDTO.ratingDTOHome.sort((a, b) => b.favorite - a.favorite);
    getHomeDTO.watchingHistoryHome = [];
    const watchingHistory = await this.watchHistoryModel
      .find({ userId: userId })
      .sort({ watchAt: -1 })
      .limit(10)
      .exec();
    for (const item of watchingHistory) {
      console.log(item);
      const video = await this.movieModel.findOne({ _id: item.videoId }).exec();
      console.log(video);
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
      .sort({ additionDate: -1 })
      .limit(3)
      .exec();

    for (const item of getMovieTrailers) {
      getHomeDTO.getMovieHomeDTO.push({
        id: item._id,
        title: item.title,
        content: item.content,
        movieUrl: item.movieLink,
      });
    }
    jsonResponse.message = MESSAGES_CODE.GET_SUCCESS;
    jsonResponse.success = true;
    jsonResponse.result = getHomeDTO;
    return jsonResponse;
  }

  // fetch Genres
  private async fetchGenres(genre: string[]): Promise<Genre[]> {
    try {
      const listGenre: Genre[] = [];
      for (const models of genre) {
        const genres = await this.genreModel.findById({ _id: models }).exec();
        listGenre.push(genres);
      }
      return listGenre;
    } catch (error) {
      throw new Error('Error fetching Genres');
    }
  }
}
