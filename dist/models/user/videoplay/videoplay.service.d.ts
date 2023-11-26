import mongoose from 'mongoose';
import { Genre } from 'src/database/schemas/genre.schema';
import { Video } from 'src/database/schemas/video.schema';
import { WatchHistory } from 'src/database/schemas/watchHistory.schema';
import { Favorites } from 'src/database/schemas/favorite.schema';
export declare class VideoplayService {
    private movieModel;
    private genreModel;
    private watchHistoryModel;
    private favoritesModel;
    constructor(movieModel: mongoose.Model<Video>, genreModel: mongoose.Model<Genre>, watchHistoryModel: mongoose.Model<WatchHistory>, favoritesModel: mongoose.Model<Favorites>);
    getVideoPlay(id: string, userId: any): Promise<any>;
    likeVideoPlay(videoId: string, userId: string, like: boolean): Promise<any>;
    private fetchGenres;
}
