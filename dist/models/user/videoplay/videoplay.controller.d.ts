import { VideoplayService } from './videoplay.service';
export declare class VideoplayController {
    private videoplayService;
    constructor(videoplayService: VideoplayService);
    findVideoPlay(id: string, req: any): Promise<any>;
    likeVideoPlay(videoId: string, like: boolean, req: any): Promise<any>;
}
