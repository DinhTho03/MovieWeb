import mongoose from 'mongoose';
import { Genre } from 'src/database/schemas/genre.schema';
import { Rating } from 'src/database/schemas/rating.schema';
import { Video } from 'src/database/schemas/video.schema';
import { WatchHistory } from 'src/database/schemas/watchHistory.schema';
export declare class HomeService {
    private movieModel;
    private genreModel;
    private ratingModel;
    private watchHistoryModel;
    constructor(movieModel: mongoose.Model<Video>, genreModel: mongoose.Model<Genre>, ratingModel: mongoose.Model<Rating>, watchHistoryModel: mongoose.Model<WatchHistory>);
    GetMovie(userId: any): Promise<any>;
    private fetchGenres;
}
