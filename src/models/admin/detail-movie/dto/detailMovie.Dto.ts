import { IsArray, IsDate, IsNumber, IsString } from 'class-validator';
import { Cast } from 'src/database/schemas/cast.schema';
import { Genre } from 'src/database/schemas/genre.schema';
import { Language } from 'src/database/schemas/language.schema';

export class DetailMovieDTO {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsDate()
  releaseYear: Date;

  @IsNumber()
  duration: number;

  @IsString()
  posterImage: string;

  @IsString()
  movieLink: string;

  @IsString()
  like: number;

  @IsNumber()
  view: number;

  @IsNumber()
  rating: number;

  @IsString()
  mpaRatings: string;

  @IsString()
  content: string;

  @IsString()
  country: string;

  @IsDate()
  additionDate: Date;

  @IsArray()
  cast: Cast[];

  @IsArray()
  genre: Genre[];

  @IsArray()
  language: Language[];
}

export default DetailMovieDTO;
