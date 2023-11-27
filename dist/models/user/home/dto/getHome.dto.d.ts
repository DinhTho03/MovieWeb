import { Genre } from 'src/database/schemas/genre.schema';
export declare class GetHomeDTO {
    getMovieHomeDTO: GetMovieHomeDTO[];
    watchingHistoryHome: WatchHistoryDTO[];
    ratingDTOHome: RatingDTO[];
}
export declare class GetMovieHomeDTO {
    id: string;
    title: string;
    content: string;
    movieUrl: string;
}
export declare class WatchHistoryDTO {
    id: string;
    title: string;
    genre: Genre[];
    posterImage: string;
}
export declare class RatingDTO {
    id: string;
    title: string;
    genre: Genre[];
    posterImage: string;
    averageRating: number;
    mpaRatings: string;
}
