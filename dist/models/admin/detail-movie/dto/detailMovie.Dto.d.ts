import { Genre } from 'src/database/schemas/genre.schema';
import { Language } from 'src/database/schemas/language.schema';
export declare class DetailMovieDTO {
    id: string;
    title: string;
    releaseYear: Date;
    duration: number;
    posterImage: string;
    movieLink: string;
    like: number;
    view: number;
    rating: number;
    mpaRatings: string;
    content: string;
    country: string;
    additionDate: Date;
    genre: Genre[];
    language: Language[];
}
export default DetailMovieDTO;
