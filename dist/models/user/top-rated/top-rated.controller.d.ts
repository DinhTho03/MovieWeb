import { TopRatedService } from './top-rated.service';
export declare class TopRatedController {
    private topRatedService;
    constructor(topRatedService: TopRatedService);
    getTopRated(): Promise<any>;
}
