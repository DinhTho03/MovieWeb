import { IsArray, IsNumber } from 'class-validator';
import MovieDTO from './movie.Dto';

class MoviesResponseDTO {
  @IsArray()
  data: MovieDTO[];

  @IsNumber()
  total: number;
}

export default MoviesResponseDTO;
