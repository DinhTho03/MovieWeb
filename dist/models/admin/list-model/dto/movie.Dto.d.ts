import RatingDTO from './rating.Dto';
import { Genre } from 'src/database/schemas/genre.schema';
declare class MovieDTO {
    id: string;
    title: string;
    MPARatings: string;
    duration: number;
    posterImage: string;
    view: number;
    like: number;
    additionDate: Date;
    rating: RatingDTO;
    genre: Genre[];
}
export default MovieDTO;
