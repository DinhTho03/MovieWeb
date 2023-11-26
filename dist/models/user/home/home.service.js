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
exports.HomeService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const genre_schema_1 = require("../../../database/schemas/genre.schema");
const rating_schema_1 = require("../../../database/schemas/rating.schema");
const video_schema_1 = require("../../../database/schemas/video.schema");
const watchHistory_schema_1 = require("../../../database/schemas/watchHistory.schema");
const json_response_model_1 = require("../../admin/list-model/json-response.model");
const getHome_dto_1 = require("./dto/getHome.dto");
const status_constants_1 = require("../../../Constant/status.constants");
let HomeService = class HomeService {
    constructor(movieModel, genreModel, ratingModel, watchHistoryModel) {
        this.movieModel = movieModel;
        this.genreModel = genreModel;
        this.ratingModel = ratingModel;
        this.watchHistoryModel = watchHistoryModel;
    }
    async GetMovie(userId) {
        const jsonResponse = new json_response_model_1.JsonResponse();
        const getHomeDTO = new getHome_dto_1.GetHomeDTO();
        getHomeDTO.ratingDTOHome = [];
        const rating = await this.ratingModel.aggregate([
            {
                $group: {
                    _id: '$videoId',
                    averageRating: { $avg: '$value' },
                },
            },
            {
                $sort: { averageRating: -1 },
            },
            {
                $limit: 3,
            },
        ]);
        for (const item of rating) {
            const video = await this.movieModel.findOne({ _id: item._id }).exec();
            const genre = await this.fetchGenres(video.genreId);
            getHomeDTO.ratingDTOHome.push({
                id: item._id,
                genre: genre,
                title: video.title,
                posterImage: video.posterImage,
                averageRating: item.averageRating,
                mpaRatings: item.mpaRatings,
            });
        }
        getHomeDTO.watchingHistoryHome = [];
        const watchingHistory = await this.watchHistoryModel
            .find({ userId: userId })
            .sort({ watchAt: -1 })
            .limit(5)
            .exec();
        for (const item of watchingHistory) {
            const video = await this.movieModel.findOne({ _id: item.videoId }).exec();
            const genre = await this.fetchGenres(video.genreId);
            getHomeDTO.watchingHistoryHome.push({
                id: item._id,
                genre: genre,
                title: video.title,
                posterImage: video.posterImage,
            });
        }
        getHomeDTO.getMovieHomeDTO = [];
        const getMovieTrailers = await this.movieModel
            .find()
            .sort({ additionDate: 1 })
            .limit(3)
            .exec();
        for (const item of getMovieTrailers) {
            const genre = await this.fetchGenres(item.genreId);
            getHomeDTO.getMovieHomeDTO.push({
                id: item._id,
                title: item.title,
                genre: genre,
                movieUrl: item.movieLink,
            });
        }
        jsonResponse.message = status_constants_1.MESSAGES_CODE.GET_SUCCESS;
        jsonResponse.success = true;
        jsonResponse.result = getHomeDTO;
        return jsonResponse;
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
            throw new Error('Error fetching Genres');
        }
    }
};
exports.HomeService = HomeService;
exports.HomeService = HomeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(video_schema_1.Video.name)),
    __param(1, (0, mongoose_1.InjectModel)(genre_schema_1.Genre.name)),
    __param(2, (0, mongoose_1.InjectModel)(rating_schema_1.Rating.name)),
    __param(3, (0, mongoose_1.InjectModel)(watchHistory_schema_1.WatchHistory.name)),
    __metadata("design:paramtypes", [mongoose_2.default.Model, mongoose_2.default.Model, mongoose_2.default.Model, mongoose_2.default.Model])
], HomeService);
//# sourceMappingURL=home.service.js.map