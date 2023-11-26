/// <reference types="multer" />
import { Video } from 'src/database/schemas/video.schema';
import mongoose from 'mongoose';
export declare class FireBaseService {
    private movieModel;
    constructor(movieModel: mongoose.Model<Video>);
    upload(file: Express.Multer.File): Promise<any>;
    uploadToStorage(tempLocalFile: string, fileName: string, mimeType: string, fileType: string): Promise<void>;
    downloadFile(videoName: string, res: any): Promise<any>;
    deleteFile(fileName: string): Promise<any>;
    updateFile(fileName: string, newFile: Express.Multer.File): Promise<any>;
}
