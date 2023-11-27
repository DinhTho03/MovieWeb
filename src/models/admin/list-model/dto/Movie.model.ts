import { IsArray, IsDate, IsNumber, IsString } from 'class-validator';
import { Genre } from 'src/database/schemas/genre.schema';
import { Language } from 'src/database/schemas/language.schema';

export class MovieRes {
  @IsString()
  title: string;
  @IsNumber()
  duration: number;
  @IsString()
  content: string;
  @IsString()
  mpaRatings: string;
  @IsDate()
  releaseYear: Date;
  @IsString()
  country: string;
  @IsArray()
  genre: Genre[];
  @IsArray()
  language: Language[];
}

export class CastRes {
  nameInFilm: string;
  nameOfActor: string;
}
