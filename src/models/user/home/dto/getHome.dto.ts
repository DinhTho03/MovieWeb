import { Genre } from 'src/database/schemas/genre.schema';

export class GetHomeDTO {
  getMovieHomeDTO: GetMovieHomeDTO[];
  watchingHistoryHome: WatchHistoryDTO[];
  ratingDTOHome: RatingDTO[];
}

export class GetMovieHomeDTO {
  id: string;
  title: string;
  content: string;
  movieUrl: string;
}

export class WatchHistoryDTO {
  id: string;
  title: string;
  genre: Genre[];
  posterImage: string;
}

export class RatingDTO {
  id: string;
  title: string;
  genre: Genre[];
  posterImage: string;
  averageRating: number;
  mpaRatings: string;
}
