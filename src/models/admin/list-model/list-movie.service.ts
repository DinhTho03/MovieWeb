import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import { Video } from 'src/database/schemas/video.schema';
import { Favorites } from 'src/database/schemas/favorite.schema';
import { Rating } from 'src/database/schemas/rating.schema';
import { Genre } from 'src/database/schemas/genre.schema';
import MoviesResponseDTO from './dto/MoviesResponse.Dto';
import MovieDTO from './dto/movie.Dto';
import { MovieRes } from './dto/Movie.model';
import { Cast } from 'src/database/schemas/cast.schema';
import { FireBaseService } from 'src/models/base-repository/firebase/fire-base-service/fire-base-service.service';
import { Language } from 'src/database/schemas/language.schema';
import { JsonResponse } from './json-response.model';
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
    private readonly firebaseService: FireBaseService,
  ) {}

  // Find All Movie
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

  // Update movie
  async updateAMovie(
    id: ObjectId,
    modelRequest: MovieRes,
    files: any,
  ): Promise<any> {
    const jsonResponse = new JsonResponse<Video>(true);
    if (id === null) {
      return new NotFoundException(
        MESSAGES_CODE.UPDATE_FAIL,
        'id is reqiuired',
      );
    }
    const video = await this.movieModel.findById(id).exec();
    if (!video) {
      return new NotFoundException(
        MESSAGES_CODE.UPDATE_FAIL,
        'Video not found',
      );
    }
    try {
      video.title = modelRequest.title;
      video.duration = modelRequest.duration;
      video.content = modelRequest.content;
      video.mpaRatings = modelRequest.mpaRatings;
      video.country = modelRequest.country;
      video.releaseYear = modelRequest.releaseYear;
      video.additionDate = new Date();
      const casts: Cast[] = [];
      let count = 0;
      const existingCast = await this.fetchCast(video.castId);
      for (const i of modelRequest.cast) {
        // Check if the cast already exists in the movie
        const nameCastInFilm = capitalizeFirstLetter(i.nameInFilm);
        const nameCastOfActor = capitalizeFirstLetter(i.nameOfActor);
        const existing = existingCast.find(
          (castId) => castId.nameInFilm === nameCastInFilm,
        );
        const avatar = await this.firebaseService.upload(files.avatar[count]);
        const idAvatar = avatar.result.url;

        if (existing !== undefined) {
          await this.firebaseService.deleteFile(existing.avatar);
          // Update existing cast
          existing.nameOfActor = nameCastOfActor;
          existing.avatar = idAvatar;
          casts.push(existing);
        } else {
          // Add new cast
          const castStore = new this.castModel();
          castStore.nameInFilm = nameCastInFilm;
          castStore.nameOfActor = nameCastOfActor;
          castStore.avatar = idAvatar;
          castStore.videoId = video._id.toString();
          video.castId.push(castStore._id.toString());
          casts.push(castStore);
        }
        count++;
      }
      console.log(video.castId);
      // Delete casts not present in the update request
      video.castId.forEach(async (existingCast) => {
        const castExistsInUpdate = casts.some(
          (updatedCast) =>
            updatedCast._id.toString() === existingCast.toString(),
        );
        if (!castExistsInUpdate) {
          console.log('existingCast', existingCast);
          const objectId = new (ObjectId as any)(existingCast);
          console.log('castExistsInUpdate', castExistsInUpdate);
          // Delete the cast that is not present in the update request
          const valueDelete = await this.castModel
            .findByIdAndDelete(objectId)
            .exec();
          this.firebaseService.deleteFile(valueDelete.avatar);
          video.castId.splice(video.castId.indexOf(existingCast), 1);
        }
      });
      console.log(video.castId);
      const genres: Genre[] = [];
      for (const i of modelRequest.genre) {
        const nameGenre = capitalizeFirstLetter(i.name);
        const existGenre = await this.genreModel
          .findOne({ name: nameGenre })
          .exec();
        if (!existGenre) {
          const genreStore = new this.genreModel();
          genreStore.name = nameGenre;
          genres.push(genreStore);
          video.genreId.push(genreStore._id.toString());
        }
      }
      const languages: Language[] = [];
      for (const i of modelRequest.language) {
        const nameLanguage = capitalizeFirstLetter(i.title);
        const existLanguage = await this.langugeModel
          .findOne({ title: nameLanguage })
          .exec();
        if (!existLanguage) {
          const languageStore = new this.langugeModel();
          languageStore.title = nameLanguage;
          languages.push(languageStore);
          video.languageId.push(languageStore._id.toString());
        }
      }
      await this.firebaseService.updateFile(
        video.posterImage,
        files.posterImage[0],
      );
      await this.firebaseService.updateFile(video.movieLink, files.movieUrl[0]);
      // Insert data
      console.log(video.castId);
      await this.movieModel.updateMany({ _id: id }, video);
      await this.castModel.create(casts);
      await this.genreModel.create(genres);
      await this.langugeModel.create(languages);
      jsonResponse.result = video;
      jsonResponse.message = MESSAGES_CODE.UPDATED_SUCCESS;
      return { jsonResponse };
    } catch (error) {
      throw new Error(error);
    }
  }

  // Add new movie
  async addMovie(modelRequest: MovieRes, files: any): Promise<any> {
    const jsonResponse = new JsonResponse<Video>(true);
    try {
      const video = new this.movieModel({
        title: modelRequest.title,
        duration: modelRequest.duration,
        content: modelRequest.content,
        mpaRatings: modelRequest.mpaRatings,
        country: modelRequest.country,
        releaseYear: modelRequest.releaseYear,
        additionDate: new Date(),
        view: 0,
      });

      const casts: Cast[] = [];
      let count = 0;
      for (const i of modelRequest.cast) {
        const nameCastInFilm = capitalizeFirstLetter(i.nameInFilm);
        const nameCastOfActor = capitalizeFirstLetter(i.nameOfActor);
        const avatar = await this.firebaseService.uploadAvatar(
          files.avatar[count],
        );
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
      for (const i of modelRequest.genre) {
        const nameGenre = capitalizeFirstLetter(i.name);
        const existGenre = await this.genreModel
          .findOne({ name: nameGenre })
          .exec();
        if (existGenre) {
          video.genreId.push((await existGenre)._id.toString());
        } else {
          const genreStore = new this.genreModel();
          genreStore.name = nameGenre;
          genres.push(genreStore);
          video.genreId.push(genreStore._id.toString());
        }
      }
      const languages: Language[] = [];
      for (const i of modelRequest.language) {
        const nameLanguage = capitalizeFirstLetter(i.title);
        const existLanguage = await this.langugeModel
          .findOne({ title: nameLanguage })
          .exec();
        if (existLanguage) {
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
      video.posterImage = await idImage.result.name;
      video.movieLink = await idMovie.result.name;
      // Insert data
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

  // Delete a movie
  async deleteAMovie(id: ObjectId): Promise<any> {
    if (id === null) {
      return new NotFoundException(
        MESSAGES_CODE.DELETE_FAIL,
        'Video not found',
      );
    }
    const value = await this.movieModel.findById(id).exec();
    if (!value) {
      return new NotFoundException(
        MESSAGES_CODE.DELETE_FAIL,
        'Video not found',
      );
    }
    const deleteMovie = await this.movieModel.findByIdAndDelete(id).exec();
    if (deleteMovie !== null) {
      await this.firebaseService.deleteFile(deleteMovie.posterImage);
      await this.firebaseService.deleteFile(deleteMovie.movieLink);
      const videoId = deleteMovie._id.toString();
      const cast = await this.castModel.find({ videoId: videoId }).exec();
      if (cast.length > 0) {
        for (const i of cast) {
          await this.castModel.findByIdAndDelete(i._id).exec();
          await this.firebaseService.deleteFile(i.avatar);
        }
      }
    }
    return MESSAGES_CODE.DELETED_SUCCESS;
  }

  // Delete list movie
  async deleteListMovie(idList: ObjectId[]): Promise<any> {
    if (idList.length === 0) {
      return new NotFoundException(
        MESSAGES_CODE.DELETE_FAIL,
        'Video not found',
      );
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

  private async fetchCast(cast: string[]): Promise<Cast[]> {
    // Assume that you have a "Favorites" model/schema defined in your application
    // and a corresponding collection in MongoDB
    try {
      const listcast: Cast[] = [];
      // Assuming you have a GenreModel or a similar model
      for (const models of cast) {
        const casts = await this.castModel.findById({ _id: models }).exec();
        listcast.push(casts);
      }
      return listcast;

      // Map the genre data to the desired format
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
