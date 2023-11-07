import {
  IsArray,
  IsDate,
  IsNumber,
  IsObject,
  IsString,
  IsUrl,
} from 'class-validator';
import RatingDTO from './rating.Dto';
import { Genre } from 'src/database/schemas/genre.schema';

class MovieDTO {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsNumber()
  duration: number;

  @IsUrl()
  posterImage: string;

  @IsNumber()
  view: number;

  @IsNumber()
  like: number;

  @IsDate()
  additionDate: Date;

  @IsObject()
  rating: RatingDTO;

  @IsArray()
  genre: Genre[];
}

export default MovieDTO;
