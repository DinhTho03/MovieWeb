"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FireBaseService = void 0;
const common_1 = require("@nestjs/common");
const status_constants_1 = require("../../../../Constant/status.constants");
const json_response_model_1 = require("../../../admin/list-model/json-response.model");
const admin = require("firebase-admin");
const fs = require("fs");
const os = require("os");
const path = require("path");
const video_schema_1 = require("../../../../database/schemas/video.schema");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
let FireBaseService = class FireBaseService {
    constructor(movieModel) {
        this.movieModel = movieModel;
    }
    async upload(file) {
        const tempLocalFile = path.join(os.tmpdir(), file.originalname);
        try {
            if (!file || !file.originalname || !file.buffer) {
                throw new common_1.HttpException('Invalid file data', 200);
            }
            const dateTime = new Date();
            const unixTimestamp = Math.floor(dateTime.getTime() / 1000);
            const fileParts = file.originalname.split('.');
            const extension = '.' + fileParts[fileParts.length - 1];
            let fileName = '';
            let maxSize, fileType;
            if (file.mimetype.match(/\/(mp4|webm|ogg)$/)) {
                fileName = `webs/${unixTimestamp}` + extension;
                maxSize = 1024 * 1024 * 1024;
                fileType = 'video';
            }
            else if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                fileName = `files/${unixTimestamp}` + extension;
                maxSize = 5 * 1024 * 1024;
                fileType = 'image';
            }
            else {
                throw new common_1.HttpException('File type not allowed (jpg/jpeg/png/gif)', 200);
            }
            if (file.size > maxSize) {
                throw new common_1.HttpException(`File size exceeds ${maxSize / (1024 * 1024)}MB`, 500);
            }
            fs.writeFileSync(tempLocalFile, file.buffer);
            this.uploadToStorage(tempLocalFile, fileName, file.mimetype, fileType);
            console.log('fileName', fileName);
            const jsonResponse = new json_response_model_1.JsonResponse(true);
            jsonResponse.message = status_constants_1.MESSAGES_CODE.UPLOAD_SUCCESS;
            jsonResponse.result = {
                name: fileName,
                url: 'pending',
            };
            return jsonResponse;
        }
        catch (error) {
            if (fs.existsSync(tempLocalFile)) {
                fs.unlinkSync(tempLocalFile);
            }
            throw new common_1.HttpException(error.toString(), 500);
        }
    }
    async uploadToStorage(tempLocalFile, fileName, mimeType, fileType) {
        try {
            const bucket = admin.storage().bucket();
            const res = await bucket.upload(tempLocalFile, {
                destination: fileName,
                metadata: {
                    cacheControl: 'public, max-age=31536000',
                    contentType: mimeType,
                    metadata: {
                        firebaseStorageDownloadTokens: '',
                    },
                },
            });
            fs.unlinkSync(tempLocalFile);
            console.log(fileName);
            const response = res[0];
            if (fileType === 'video') {
                const video = await this.movieModel
                    .findOne({ movieLink: fileName })
                    .exec();
                if (video) {
                    video.movieLink = `https://firebasestorage.googleapis.com/v0/b/${response.metadata.bucket}/o/${response.id}?alt=media`;
                    await video.save();
                }
            }
            if (fileType === 'image') {
                const video = await this.movieModel
                    .findOne({ posterImage: fileName })
                    .exec();
                if (video) {
                    video.posterImage = `https://firebasestorage.googleapis.com/v0/b/${response.metadata.bucket}/o/${response.id}?alt=media`;
                    await video.save();
                }
            }
        }
        catch (error) {
            if (fs.existsSync(tempLocalFile)) {
                fs.unlinkSync(tempLocalFile);
            }
            throw new common_1.HttpException(error.toString(), 200);
        }
    }
    async downloadFile(videoName, res) {
        try {
            const bucket = admin.storage().bucket().file(`webs/${videoName}`);
            const [fileContents] = await bucket.download();
            res.setHeader('Content-Type', 'video/mp4');
            res.setHeader('Content-Disposition', `attachment; filename=${videoName}`);
            res.status(common_1.HttpStatus.OK).send(fileContents);
        }
        catch (error) {
            console.error('Error downloading video:', error);
            res
                .status(common_1.HttpStatus.INTERNAL_SERVER_ERROR)
                .send('Error downloading video');
        }
    }
    async deleteFile(fileName) {
        const jsonResponse = new json_response_model_1.JsonResponse(true);
        const parts = fileName.split('/');
        const filenameWithQuery = parts[parts.length - 1];
        const filenameAfterQuery = filenameWithQuery.split('?')[0];
        const filenameSeparated = filenameAfterQuery.split('2F')[1];
        try {
            const bucket = admin.storage().bucket();
            const fileExtension = filenameSeparated.split('.').pop().toLowerCase();
            let folderName = '';
            if (['mp4', 'webm', 'ogg'].includes(fileExtension)) {
                folderName = 'webs';
            }
            else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
                folderName = 'files';
                console.log('folderName', folderName);
            }
            const file = bucket.file(`${folderName}/${filenameSeparated}`);
            const [exists] = await file.exists();
            if (!exists) {
                jsonResponse.success = false;
                jsonResponse.message = status_constants_1.MESSAGES_CODE.DELETE_FAIL;
                return jsonResponse;
            }
            await file
                .createReadStream()
                .on('data', () => { })
                .on('end', async () => {
                await file.delete();
            });
            jsonResponse.message = status_constants_1.MESSAGES_CODE.DELETED_SUCCESS;
            return jsonResponse;
        }
        catch (error) {
            console.error('Error deleting file:', error);
            jsonResponse.success = false;
            jsonResponse.message = status_constants_1.MESSAGES_CODE.DELETE_FAIL;
            return jsonResponse;
        }
    }
    async updateFile(fileName, newFile) {
        console.log(newFile.originalname);
        const tempLocalFile = path.join(os.tmpdir(), newFile.originalname);
        try {
            if (!newFile || !newFile.originalname || !newFile.buffer) {
                throw new common_1.HttpException('Invalid new file data', 200);
            }
            fs.writeFileSync(tempLocalFile, newFile.buffer);
            let folderName;
            const bucket = admin.storage().bucket();
            if (newFile.mimetype.match(/\/(mp4|webm|ogg)$/)) {
                folderName = 'webs';
            }
            if (newFile.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                folderName = 'files';
            }
            const parts = fileName.split('/');
            const filenameWithQuery = parts[parts.length - 1];
            const filenameAfterQuery = filenameWithQuery.split('?')[0];
            const filenameSeparated = filenameAfterQuery.split('2F')[1];
            const file = bucket.file(`${folderName}/${filenameSeparated}`);
            const [exists] = await file.exists();
            console.log('exists', exists);
            if (exists) {
                const res = await file
                    .createWriteStream({
                    metadata: {
                        cacheControl: 'public, max-age=31536000',
                        contentType: newFile.mimetype,
                    },
                })
                    .on('error', (error) => {
                    throw new common_1.HttpException(error.toString(), 500);
                })
                    .on('finish', async () => {
                    fs.unlinkSync(tempLocalFile);
                });
                fs.createReadStream(tempLocalFile).pipe(res);
                const jsonResponse = new json_response_model_1.JsonResponse(true);
                jsonResponse.message = status_constants_1.MESSAGES_CODE.UPDATED_SUCCESS;
                return jsonResponse;
            }
            else {
                throw new common_1.HttpException(status_constants_1.MESSAGES_CODE.UPDATE_FAIL, 404);
            }
        }
        catch (error) {
            if (fs.existsSync(tempLocalFile)) {
                fs.unlinkSync(tempLocalFile);
            }
            throw new common_1.HttpException(error.toString(), 500);
        }
    }
};
exports.FireBaseService = FireBaseService;
exports.FireBaseService = FireBaseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(video_schema_1.Video.name)),
    __metadata("design:paramtypes", [mongoose_1.default.Model])
], FireBaseService);
//# sourceMappingURL=fire-base-service.service.js.map