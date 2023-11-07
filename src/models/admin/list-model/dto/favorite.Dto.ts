import { IsString } from 'class-validator';

class GenreDTO {
  @IsString()
  id: string;

  @IsString()
  name: string;
}

export default GenreDTO;
