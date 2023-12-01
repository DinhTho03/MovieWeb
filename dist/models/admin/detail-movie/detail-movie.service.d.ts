import mongoose from 'mongoose';
import { Favorites } from 'src/database/schemas/favorite.schema';
import { Genre } from 'src/database/schemas/genre.schema';
import { Rating } from 'src/database/schemas/rating.schema';
import { Video } from 'src/database/schemas/video.schema';
import { Language } from 'src/database/schemas/language.schema';
import { ObjectId } from 'mongodb';
import { ListModelService } from '../list-model/list-movie.service';
import { MovieRes } from '../list-model/dto/Movie.model';
import { WatchHistory } from 'src/database/schemas/watchHistory.schema';
export declare class DetailMovieService {
    private movieModel;
    private favoritesModel;
    private ratingModel;
    private genreModel;
    private languageModel;
    private watchHistoryModel;
    private readonly listModelService;
    constructor(movieModel: mongoose.Model<Video>, favoritesModel: mongoose.Model<Favorites>, ratingModel: mongoose.Model<Rating>, genreModel: mongoose.Model<Genre>, languageModel: mongoose.Model<Language>, watchHistoryModel: mongoose.Model<WatchHistory>, listModelService: ListModelService);
    getDetailMovie(videoId: string): Promise<any>;
    deleteAMovie(videoId: ObjectId, userId: any): Promise<any>;
    updateAMovie(id: ObjectId, modelRequest: MovieRes, files: any): Promise<any>;
    private fetchGenres;
    private fetchLanguages;
}
