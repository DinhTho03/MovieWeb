import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import { Video } from 'src/database/schemas/video.schema';
import { Favorites } from 'src/database/schemas/favorite.schema';
import { Rating } from 'src/database/schemas/rating.schema';
import { Genre } from 'src/database/schemas/genre.schema';
import MoviesResponseDTO from './dto/MoviesResponse.Dto';
import MovieDTO from './dto/movie.Dto';
import { ModelService } from 'src/models/model/model.service';
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
    private readonly modelService: ModelService<Video>,
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
      console.log(genre.id);
      if (genre) {
        const videosByGenre = await this.movieModel
          .find({ genreId: { $in: genre._id } }) // Use the genreIdString directly
          .skip(skipAmount)
          .limit(this.pageSize)
          .exec();
        console.log(videosByGenre);
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

  async deleteAMovie(id: ObjectId): Promise<void> {
    return await this.modelService.findMovie(id);
  }

  async deleteListMovie(idList: ObjectId[]): Promise<void> {
    if (idList.length === 0) {
      throw new Error('Video not found');
    }
    for (const id of idList) {
      const video = await this.movieModel.findById(id).exec();
      if (video === null) {
        throw new Error('Video not found');
      } else {
        await this.movieModel.findByIdAndDelete(id).exec();
      }
    }
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
