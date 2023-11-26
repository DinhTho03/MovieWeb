import mongoose from 'mongoose';
import { Rating } from 'src/database/schemas/rating.schema';
import { Video } from 'src/database/schemas/video.schema';
import { GetTopRatingDTO } from './dto/top-rating.dto';
import { Genre } from 'src/database/schemas/genre.schema';
import { JsonResponse } from 'src/models/admin/list-model/json-response.model';
export declare class TopRatedService {
    private movieModel;
    private genreModel;
    private ratingModel;
    constructor(movieModel: mongoose.Model<Video>, genreModel: mongoose.Model<Genre>, ratingModel: mongoose.Model<Rating>);
    getTopRated(): Promise<JsonResponse<GetTopRatingDTO>>;
    private fetchGenres;
}
