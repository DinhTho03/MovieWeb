import { Genre } from 'src/database/schemas/genre.schema';
export declare class GetTopRatingDTO {
    getMovieHomeDTO: GetMovieHomeDTO[];
    ratingDTOHome: RatingDTO[];
}
export declare class GetMovieHomeDTO {
    id: string;
    title: string;
    genre: Genre[];
    posterImage: string;
    averageRating: number;
}
export declare class RatingDTO {
    id: string;
    title: string;
    genre: Genre[];
    posterImage: string;
    averageRating: number;
    mpaRatings: string;
}
