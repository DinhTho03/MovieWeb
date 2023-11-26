import { Genre } from 'src/database/schemas/genre.schema';
export declare class VideoPlayDTO {
    id: string;
    title: string;
    movieLink: string;
    mpaRatings: string;
    content: string;
    genre: Genre[];
}
