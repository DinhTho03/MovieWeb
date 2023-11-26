// import { Cast } from 'src/database/schemas/cast.schema';
import { Genre } from 'src/database/schemas/genre.schema';

export class VideoPlayDTO {
  id: string;
  title: string;
  movieLink: string;
  mpaRatings: string;
  content: string;
  // cast: Cast[];
  genre: Genre[];
}
