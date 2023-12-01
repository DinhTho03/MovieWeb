import { DetailMovieService } from './detail-movie.service';
import { MovieRes } from '../list-model/dto/Movie.model';
export declare class DetailMovieController {
    private detailMovie;
    constructor(detailMovie: DetailMovieService);
    getDetailMovie(id: string): Promise<any>;
    deleteMovie(id: string, req: any): Promise<any>;
    updateMovie(id: string, modelRequest: MovieRes, files: any): Promise<any>;
}
