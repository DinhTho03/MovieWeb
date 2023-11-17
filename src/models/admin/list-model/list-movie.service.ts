import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Video, VideoSchema } from 'src/database/schemas/video.schema';
import { Favorites } from 'src/database/schemas/favorite.schema';
import { Rating } from 'src/database/schemas/rating.schema';
import { Genre, GenreSchema } from 'src/database/schemas/genre.schema';
import MoviesResponseDTO from './dto/MoviesResponse.Dto';
import MovieDTO from './dto/movie.Dto';
import { ModelService } from '../../base-repository/Movie/model.service';
import { MovieRes } from './dto/Movie.model';
import { Cast, CastSchema } from 'src/database/schemas/cast.schema';
import { FireBaseService } from 'src/models/base-repository/firebase/fire-base-service/fire-base-service.service';
import { Language, LanguageSchema } from 'src/database/schemas/language.schema';
import { JsonResponse } from './json-response.model';
import { v4 as uuidv4 } from 'uuid';
import { MESSAGES_CODE } from 'src/Constant/status.constants';
// import MovieDTO from './Dto/movie.Dto';

@Injectable()
export class ListModelService {
  private pageSize = 9;
  constructor(
    @InjectModel(Video.name)
    private movieModel: mongoose.Model<Video>,
    @InjectModel(Favorites.name)
    private favoritesModel: mongoose.Model<Favorites>,
    @InjectModel(Rating.name)
    private ratingModel: mongoose.Model<Rating>,
    @InjectModel(Genre.name)
    private genreModel: mongoose.Model<Genre>,
    @InjectModel(Language.name)
    private langugeModel: mongoose.Model<Language>,
    @InjectModel(Cast.name)
    private castModel: mongoose.Model<Cast>,
    private readonly modelService: ModelService<Video>,
    private readonly firebaseService: FireBaseService,
  ) {}
  async FindAll(
    searchQuery: string | undefined,
    // additionDate: boolean | undefined,
    // sortbyView: boolean | undefined,
    // sortByLike: boolean | undefined,
    // sortByRating: boolean | undefined,
    pageNumber: number = 1,
  ): Promise<MoviesResponseDTO> {
    const skipAmount = this.pageSize * (pageNumber - 1);
    let videoFilter: Video[] = [];

    if (searchQuery) {
      // Perform a case-insensitive title search
      const titleRegex = new RegExp(searchQuery, 'i');
      videoFilter = await this.movieModel
        .find({ title: titleRegex })
        .skip(skipAmount)
        .limit(this.pageSize)
        .exec();
      const genreRegex = new RegExp(searchQuery, 'i');
      const genre = await this.genreModel.findOne({ name: genreRegex }).exec();
      if (genre) {
        const videosByGenre = await this.movieModel
          .find({ genreId: { $in: genre._id } }) // Use the genreIdString directly
          .skip(skipAmount)
          .limit(this.pageSize)
          .exec();
        // Append the videos from videosByGenre into videoFilter
        videoFilter = videoFilter.concat(videosByGenre);
      }
    }
    if (videoFilter.length === 0) {
      // If no search term or no matching videos, retrieve all videos with pagination
      videoFilter = await this.movieModel
        .find()
        .skip(skipAmount)
        .limit(this.pageSize)
        .exec();
    }
    // Để tính tổng số trang, bạn có thể sử dụng một truy vấn riêng biệt
    const totalPage = Math.ceil(
      (await this.movieModel.countDocuments()) / this.pageSize,
    );

    const listProducts: MovieDTO[] = [];
    for (const video of videoFilter) {
      // Fetch ratings for the video
      const ratings = await this.fetchRatings(video.id);
      // Fetch favorites for the video
      const favorites = await this.fetchFavorites(video.id);
      // Calculate the average rating for the video
      const { averageRating, quality } = this.calculateAverageRating(ratings);
      // Fetch genre information for the video
      const genreInfo = await this.fetchGenres(video.genreId); // Replace with your actual function to fetch genres

      // Populate ListProductModel instance
      const listProduct: MovieDTO = {
        id: video.id,
        MPARatings: video.mpaRatings,
        title: video.title,
        duration: video.duration,
        posterImage: `http://streamapi.com/images/${video.posterImage}`,
        view: video.view,
        additionDate: video.additionDate,
        rating: { rating: averageRating, quality },
        like: favorites.length, // Count of favorites
        genre: genreInfo, // You can populate this based on your data model
      };
      listProducts.push(listProduct);
    }

    return {
      data: listProducts,
      total: totalPage,
    };
  }

  async addMovie(modelrequest: MovieRes, files: any): Promise<any> {
    const jsonResponse = new JsonResponse<Video>(true);
    try {
      const video = new this.movieModel({
        title: modelrequest.title,
        duration: modelrequest.duration,
        content: modelrequest.content,
        mpaRatings: modelrequest.mpaRatings,
        country: modelrequest.country,
        releaseYear: modelrequest.releaseYear,
        additionDate: new Date(),
        view: 0,
      });

      const casts: Cast[] = [];
      let count = 0;
      for (const i of modelrequest.cast) {
        const nameCastInFilm = capitalizeFirstLetter(i.nameInFilm);
        const nameCastOfActor = capitalizeFirstLetter(i.nameOfActor);
        const avatar = await this.firebaseService.upload(files.avatar[count]);
        const idAvatar = avatar.result.url;
        const castStore = new this.castModel();
        castStore.nameInFilm = nameCastInFilm;
        castStore.nameOfActor = nameCastOfActor;
        castStore.avatar = idAvatar;
        castStore.videoId = video._id.toString();
        casts.push(castStore);
        video.castId.push(castStore._id.toString());
        count++;
      }
      const genres: Genre[] = [];
      for (const i of modelrequest.genre) {
        const nameGenre = capitalizeFirstLetter(i.name);
        const existGenre = await this.genreModel
          .findOne({ name: nameGenre })
          .exec();
        if (existGenre) {
          console.log(1);
          video.genreId.push((await existGenre)._id.toString());
        } else {
          const genreStore = new this.genreModel();
          genreStore.name = nameGenre;
          genres.push(genreStore);
          video.genreId.push(genreStore._id.toString());
        }
      }
      const languages: Language[] = [];
      for (const i of modelrequest.language) {
        const nameLanguage = capitalizeFirstLetter(i.title);
        const existLanguage = await this.langugeModel
          .findOne({ title: nameLanguage })
          .exec();
        if (existLanguage) {
          console.log(2);
          video.languageId.push((await existLanguage)._id.toString());
        } else {
          const languageStore = new this.langugeModel();
          languageStore.title = nameLanguage;
          languages.push(languageStore);
          video.languageId.push(languageStore._id.toString());
        }
      }

      const idImage = await this.firebaseService.upload(files.posterImage[0]);
      const idMovie = await this.firebaseService.upload(files.movieUrl[0]);
      video.posterImage = await idImage.result.url;
      video.movieLink = await idMovie.result.url;
      // Insert data
      await this.movieModel.create(video);
      await this.movieModel.create(video);
      await this.castModel.create(casts);
      await this.genreModel.create(genres);
      await this.langugeModel.create(languages);
      jsonResponse.result = video;
      jsonResponse.message = MESSAGES_CODE.CREATED_SUCCESS;
      return { jsonResponse };
    } catch (error) {
      jsonResponse.success = false;
      jsonResponse.results = error;
      jsonResponse.message = MESSAGES_CODE.CREATE_FAIL;
      return { jsonResponse };
    }
  }

  async deleteAMovie(id: ObjectId): Promise<any> {
    if (id === null) {
      throw new Error(MESSAGES_CODE.CREATE_FAIL);
    }
    const video = await this.modelService.deleteMovie(id);
    await this.firebaseService.deleteFile(video.posterImage);
    await this.firebaseService.deleteFile(video.movieLink);
    const videoId = video._id.toString();
    const cast = await this.castModel.find({ videoId: videoId }).exec();
    if (cast.length > 0) {
      for (const i of cast) {
        await this.castModel.findByIdAndDelete(i._id).exec();
        await this.firebaseService.deleteFile(i.avatar);
      }
    }
    return video;
  }

  async deleteListMovie(idList: ObjectId[]): Promise<void> {
    if (idList.length === 0) {
      throw new Error('Video not found');
    }
    let video;
    for (const id of idList) {
      video = this.deleteAMovie(id);
    }
    return video;
  }

  private async fetchRatings(videoId: string): Promise<Rating[]> {
    // Assume that you have a "Rating" model/schema defined in your application
    // and a corresponding collection in MongoDB
    try {
      const ratings = await this.ratingModel.find({ VideoId: videoId }).exec();
      return ratings;
    } catch (error) {
      // Handle any errors that might occur during the database query
      throw new Error('Error fetching ratings');
    }
  }
  private async fetchFavorites(videoId: string): Promise<Favorites[]> {
    // Assume that you have a "Favorites" model/schema defined in your application
    // and a corresponding collection in MongoDB
    try {
      const favorites = await this.favoritesModel.find({ _id: videoId }).exec();
      return favorites;
    } catch (error) {
      // Handle any errors that might occur during the database query
      throw new Error('Error fetching favorites');
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
  private calculateAverageRating(ratings: Rating[]): {
    averageRating: number;
    quality: number;
  } {
    if (!ratings || ratings.length === 0) {
      return { averageRating: 0, quality: 0 };
    }
    let totalRating = 0;
    let totalQuality = 0;
    for (const rating of ratings) {
      totalRating += rating.value;
      totalQuality++;
    }
    const averageRating = totalRating / totalQuality;
    return { averageRating, quality: totalQuality };
  }
}
//
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
