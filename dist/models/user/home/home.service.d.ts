import mongoose from 'mongoose';
import { Genre } from 'src/database/schemas/genre.schema';
import { Rating } from 'src/database/schemas/rating.schema';
import { Video } from 'src/database/schemas/video.schema';
import { WatchHistory } from 'src/database/schemas/watchHistory.schema';
import { Favorites } from 'src/database/schemas/favorite.schema';
export declare class HomeService {
    private movieModel;
    private genreModel;
    private ratingModel;
    private watchHistoryModel;
    private favoritesModel;
    constructor(movieModel: mongoose.Model<Video>, genreModel: mongoose.Model<Genre>, ratingModel: mongoose.Model<Rating>, watchHistoryModel: mongoose.Model<WatchHistory>, favoritesModel: mongoose.Model<Favorites>);
    GetMovie(userId: any): Promise<any>;
    private fetchGenres;
}
