import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Rating } from 'src/database/schemas/rating.schema';
import { Video } from 'src/database/schemas/video.schema';
import { GetTopRatingDTO } from './dto/top-rating.dto';
import { Genre } from 'src/database/schemas/genre.schema';
import { JsonResponse } from 'src/models/admin/list-model/json-response.model';
import { MESSAGES_CODE } from 'src/Constant/status.constants';

@Injectable()
export class TopRatedService {
  constructor(
    @InjectModel(Video.name)
    private movieModel: mongoose.Model<Video>,
    @InjectModel(Genre.name)
    private genreModel: mongoose.Model<Genre>,
    @InjectModel(Rating.name)
    private ratingModel: mongoose.Model<Rating>,
  ) {}
  async getTopRated() {
    const jsonResponse = new JsonResponse<GetTopRatingDTO>(true);
    const getTopRatingDTO = new GetTopRatingDTO();
    const movie = await this.movieModel
      .find()
      .sort({ additionDate: -1 })
      .limit(8)
      .exec();
    getTopRatingDTO.getMovieHomeDTO = [];
    for (const item of movie) {
      const genre = await this.fetchGenres(item.genreId);

      const ratings = await this.ratingModel
        .aggregate([
          { $match: { videoId: item._id.toString() } },
          { $group: { _id: null, averageRating: { $avg: '$value' } } },
        ])
        .exec();

      const averageRating = ratings.length > 0 ? ratings[0].averageRating : 0;
      getTopRatingDTO.getMovieHomeDTO.push({
        id: item._id,
        title: item.title,
        genre: genre,
        posterImage: item.posterImage,
        averageRating: averageRating,
      });
    }
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
        $limit: 6,
      },
    ]);
    getTopRatingDTO.ratingDTOHome = [];
    for (const item of rating) {
      const video = await this.movieModel.findOne({ _id: item._id }).exec();
      const genre = await this.fetchGenres(video.genreId);
      getTopRatingDTO.ratingDTOHome.push({
        id: item._id,
        genre: genre,
        title: video.title,
        posterImage: video.posterImage,
        averageRating: item.averageRating,
        mpaRatings: video.mpaRatings,
      });
    }

    jsonResponse.result = getTopRatingDTO;
    jsonResponse.message = MESSAGES_CODE.GET_SUCCESS;
    return jsonResponse;
  }

  private async fetchGenres(genre: string[]): Promise<Genre[]> {
    try {
      const listGenre: Genre[] = [];
      for (const models of genre) {
        const genres = await this.genreModel.findById({ _id: models }).exec();
        listGenre.push(genres);
      }
      return listGenre;
    } catch (error) {
      throw new Error('Error fetching genres');
    }
  }
}
