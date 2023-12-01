import { IsArray, IsString } from 'class-validator';
import { CastRes } from './Movie.model';

export class TestAPI {
  @IsString()
  test: string;
  @IsArray()
  cast: string;
}
