import { Genre } from 'src/database/schemas/genre.schema';
import { Language } from 'src/database/schemas/language.schema';
export declare class MovieRes {
    title: string;
    duration: number;
    content: string;
    mpaRatings: string;
    releaseYear: Date;
    country: string;
    genre: Genre[];
    language: Language[];
}
export declare class CastRes {
    nameInFilm: string;
    nameOfActor: string;
}
