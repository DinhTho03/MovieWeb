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
exports.VideoplayService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const status_constants_1 = require("../../../Constant/status.constants");
const genre_schema_1 = require("../../../database/schemas/genre.schema");
const video_schema_1 = require("../../../database/schemas/video.schema");
const json_response_model_1 = require("../../admin/list-model/json-response.model");
const watchHistory_schema_1 = require("../../../database/schemas/watchHistory.schema");
const favorite_schema_1 = require("../../../database/schemas/favorite.schema");
const rating_schema_1 = require("../../../database/schemas/rating.schema");
let VideoplayService = class VideoplayService {
    constructor(movieModel, genreModel, watchHistoryModel, favoritesModel, ratingModel) {
        this.movieModel = movieModel;
        this.genreModel = genreModel;
        this.watchHistoryModel = watchHistoryModel;
        this.favoritesModel = favoritesModel;
        this.ratingModel = ratingModel;
    }
    async getVideoPlay(id, userId) {
        const jsonResponse = new json_response_model_1.JsonResponse();
        if (!id) {
            jsonResponse.success = false;
            jsonResponse.message = status_constants_1.MESSAGES_CODE.GET_FAIL;
            jsonResponse.result = 'Id is required';
            return jsonResponse;
        }
        const videoPlay = await this.movieModel.findOne({ _id: id }).exec();
        videoPlay.view += 1;
        await videoPlay.save();
        if (!videoPlay) {
            jsonResponse.success = false;
            jsonResponse.message = status_constants_1.MESSAGES_CODE.GET_FAIL;
            jsonResponse.result = 'Video not found';
            return jsonResponse;
        }
        const genre = await this.fetchGenres(videoPlay.genreId);
        const dataVideo = {
            id: videoPlay._id,
            title: videoPlay.title,
            movieLink: videoPlay.movieLink,
            mpaRatings: videoPlay.mpaRatings,
            content: videoPlay.content,
            genre: genre,
        };
        const watchHistoryFilter = await this.watchHistoryModel
            .findOne({ videoId: id, userId: userId })
            .exec();
        if (watchHistoryFilter) {
            watchHistoryFilter.watchAt = new Date();
            await watchHistoryFilter.save();
        }
        else {
            const watchHistory = new this.watchHistoryModel();
            watchHistory.videoId = id;
            watchHistory.userId = userId;
            watchHistory.watchAt = new Date();
            await watchHistory.save();
        }
        jsonResponse.success = true;
        jsonResponse.message = status_constants_1.MESSAGES_CODE.GET_SUCCESS;
        jsonResponse.result = dataVideo;
        return jsonResponse;
    }
    async likeVideoPlay(videoId, userId, like) {
        console.log(like);
        try {
            if (like) {
                const videoPlay = new this.favoritesModel({
                    videoId: videoId,
                    userId: userId,
                    additionDate: new Date(),
                });
                console.log(1);
                await videoPlay.save();
                return videoPlay;
            }
            else {
                console.log(2);
                const videoPlay = await this.favoritesModel
                    .findOneAndDelete({ videoId: videoId, userId: userId })
                    .exec();
                if (videoPlay) {
                    return videoPlay;
                }
                else {
                    console.log('Video not found in favorites.');
                    return null;
                }
            }
        }
        catch (error) {
            console.error('Error in likeVideoPlay:', error.message);
            throw error;
        }
    }
    async ratingVideoPlay(videoId, userId, rate) {
        try {
            const existRating = await this.ratingModel
                .findOne({ videoId: videoId, userId: userId })
                .exec();
            if (!existRating) {
                const rating = new this.ratingModel({
                    videoId: videoId,
                    userId: userId,
                    value: rate,
                });
                await rating.save();
                return rating;
            }
            else {
                existRating.value = rate;
                await existRating.save();
                return existRating;
            }
        }
        catch (error) {
            console.error('Error in likeVideoPlay:', error.message);
            throw error;
        }
    }
    async fetchGenres(genre) {
        try {
            const listGenre = [];
            for (const models of genre) {
                const genres = await this.genreModel.findById({ _id: models }).exec();
                listGenre.push(genres);
            }
            return listGenre;
        }
        catch (error) {
            throw new Error('Error fetching favorites');
        }
    }
};
exports.VideoplayService = VideoplayService;
exports.VideoplayService = VideoplayService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(video_schema_1.Video.name)),
    __param(1, (0, mongoose_1.InjectModel)(genre_schema_1.Genre.name)),
    __param(2, (0, mongoose_1.InjectModel)(watchHistory_schema_1.WatchHistory.name)),
    __param(3, (0, mongoose_1.InjectModel)(favorite_schema_1.Favorites.name)),
    __param(4, (0, mongoose_1.InjectModel)(rating_schema_1.Rating.name)),
    __metadata("design:paramtypes", [mongoose_2.default.Model, mongoose_2.default.Model, mongoose_2.default.Model, mongoose_2.default.Model, mongoose_2.default.Model])
], VideoplayService);
//# sourceMappingURL=videoplay.service.js.map