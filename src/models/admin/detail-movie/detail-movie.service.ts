import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
// import { Cast } from 'src/database/schemas/cast.schema';
import { Favorites } from 'src/database/schemas/favorite.schema';
import { Genre } from 'src/database/schemas/genre.schema';
import { Rating } from 'src/database/schemas/rating.schema';
import { Video } from 'src/database/schemas/video.schema';
import DetailMovieDTO from './dto/detailMovie.Dto';
import { Language } from 'src/database/schemas/language.schema';
import { ObjectId } from 'mongodb';
import { ListModelService } from '../list-model/list-movie.service';
import { MESSAGES_CODE } from 'src/Constant/status.constants';
import { MovieRes } from '../list-model/dto/Movie.model';

@Injectable()
export class DetailMovieService {
  constructor(
    @InjectModel(Video.name)
    private movieModel: mongoose.Model<Video>,
    @InjectModel(Favorites.name)
    private favoritesModel: mongoose.Model<Favorites>,
    @InjectModel(Rating.name)
    private ratingModel: mongoose.Model<Rating>,
    @InjectModel(Genre.name)
    private genreModel: mongoose.Model<Genre>,
    // @InjectModel(Cast.name)
    // private castModel: mongoose.Model<Cast>,
    @InjectModel(Language.name)
    private languageModel: mongoose.Model<Language>,
    private readonly listModelService: ListModelService,
  ) {}
  async getDetailMovie(videoId: string): Promise<any> {
    const video = await this.movieModel.findOne({ _id: videoId }).exec();
    if (video) {
      // const cast = await this.castModel.find({ videoId: video._id }).exec();
      const genreInfo = await this.fetchGenres(video.genreId);
      const languageInfo = await this.fetchLanguages(video.languageId);
      const ratingInfo = await this.ratingModel.find({ videoId: video.id });
      const favoritesInfo = await this.favoritesModel.find({
        videoId: video.id,
      });
      const aNumberOfLike = favoritesInfo.length;
      let valueRating = 0;
      for (const rating of ratingInfo) {
        valueRating += rating.value;
      }

      const totalRating = valueRating / ratingInfo.length;
      const getdetailMovie: DetailMovieDTO = {
        id: video._id,
        title: video.title,
        releaseYear: video.releaseYear,
        duration: video.duration,
        posterImage: video.posterImage,
        movieLink: video.movieLink,
        view: video.view,
        rating: totalRating,
        mpaRatings: video.mpaRatings,
        content: video.content,
        country: video.country,
        like: aNumberOfLike, // You need to fetch the "like" count from somewhere
        additionDate: video.additionDate,
        // cast: cast,
        genre: genreInfo,
        language: languageInfo,
      };

      return getdetailMovie;
    } else {
      return new NotFoundException(MESSAGES_CODE.GET_FAIL, 'Video not found'); // Handle the case where no video is found with the given videoId
    }
  }

  async deleteAMovie(videoId: ObjectId): Promise<any> {
    const deleteMovie = await this.listModelService.deleteAMovie(videoId);
    return deleteMovie;
  }

  async updateAMovie(
    id: ObjectId,
    modelRequest: MovieRes,
    files: any,
  ): Promise<any> {
    const update = await this.listModelService.updateAMovie(
      id,
      modelRequest,
      files,
    );
    return update;
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
  private async fetchLanguages(language: string[]): Promise<Language[]> {
    // Assume that you have a "Favorites" model/schema defined in your application
    // and a corresponding collection in MongoDB
    try {
      const listLanguage: Language[] = [];
      // Assuming you have a GenreModel or a similar model
      for (const models of language) {
        const languages = await this.languageModel
          .findById({ _id: models })
          .exec();
        listLanguage.push(languages);
      }
      return listLanguage;

      // Map the genre data to the desired format
    } catch (error) {
      // Handle any errors that might occur during the database query
      throw new Error('Error fetching favorites');
    }
  }
}
