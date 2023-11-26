import { Genre } from 'src/database/schemas/genre.schema';

export class GetTopRatingDTO {
  getMovieHomeDTO: GetMovieHomeDTO[];
  ratingDTOHome: RatingDTO[];
}

export class GetMovieHomeDTO {
  id: string;
  title: string;
  genre: Genre[];
  posterImage: string;
  averageRating: number;
}

export class RatingDTO {
  id: string;
  title: string;
  genre: Genre[];
  posterImage: string;
  averageRating: number;
  mpaRatings: string;
}
