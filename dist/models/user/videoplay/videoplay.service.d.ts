import mongoose from 'mongoose';
import { Genre } from 'src/database/schemas/genre.schema';
import { Video } from 'src/database/schemas/video.schema';
import { WatchHistory } from 'src/database/schemas/watchHistory.schema';
import { Favorites } from 'src/database/schemas/favorite.schema';
import { Rating } from 'src/database/schemas/rating.schema';
export declare class VideoplayService {
    private movieModel;
    private genreModel;
    private watchHistoryModel;
    private favoritesModel;
    private ratingModel;
    constructor(movieModel: mongoose.Model<Video>, genreModel: mongoose.Model<Genre>, watchHistoryModel: mongoose.Model<WatchHistory>, favoritesModel: mongoose.Model<Favorites>, ratingModel: mongoose.Model<Rating>);
    getVideoPlay(id: string, userId: any): Promise<any>;
    likeVideoPlay(videoId: string, userId: string, like: boolean): Promise<any>;
    ratingVideoPlay(videoId: string, userId: string, rate: number): Promise<any>;
    private fetchGenres;
}
