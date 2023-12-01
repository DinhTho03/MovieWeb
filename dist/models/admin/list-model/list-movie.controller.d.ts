import { ListModelService } from './list-movie.service';
import { FireBaseService } from 'src/models/base-repository/firebase/fire-base-service/fire-base-service.service';
import { MovieRes } from './dto/Movie.model';
import { TestAPI } from './dto/genre.Dto';
export declare class ListModelController {
    private listModelService;
    private firebaseService;
    private readonly logger;
    constructor(listModelService: ListModelService, firebaseService: FireBaseService);
    findAll(searchQuery: string, additionDate: boolean | undefined, sortbyView: boolean | undefined, sortByLike: boolean | undefined, sortByRating: boolean | undefined, pageNumber?: number): Promise<import("./dto/MoviesResponse.Dto").default>;
    deleteAMovie(id: string, req: any): Promise<any>;
    deleteListMovie(ids: string[], req: any): Promise<any>;
    addMovie(modelRequest: MovieRes, files: any): Promise<any>;
    updateMovie(id: string, modelRequest: MovieRes, files: any): Promise<any>;
    addCast(test: TestAPI, files: any): Promise<any>;
}
