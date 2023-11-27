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
exports.TopRatedService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const rating_schema_1 = require("../../../database/schemas/rating.schema");
const video_schema_1 = require("../../../database/schemas/video.schema");
const top_rating_dto_1 = require("./dto/top-rating.dto");
const genre_schema_1 = require("../../../database/schemas/genre.schema");
const json_response_model_1 = require("../../admin/list-model/json-response.model");
const status_constants_1 = require("../../../Constant/status.constants");
let TopRatedService = class TopRatedService {
    constructor(movieModel, genreModel, ratingModel) {
        this.movieModel = movieModel;
        this.genreModel = genreModel;
        this.ratingModel = ratingModel;
    }
    async getTopRated(searchQuery) {
        const jsonResponse = new json_response_model_1.JsonResponse(true);
        const getTopRatingDTO = new top_rating_dto_1.GetTopRatingDTO();
        const movieQuery = searchQuery
            ? { title: { $regex: new RegExp(searchQuery, 'i') } }
            : {};
        const topMovies = await this.movieModel
            .find(movieQuery)
            .sort({ additionDate: -1 })
            .limit(8)
            .exec();
        getTopRatingDTO.getMovieHomeDTO = await Promise.all(topMovies.map(async (item) => {
            const genre = await this.fetchGenres(item.genreId);
            const ratings = await this.ratingModel
                .aggregate([
                { $match: { videoId: item._id.toString() } },
                { $group: { _id: null, averageRating: { $avg: '$value' } } },
            ])
                .exec();
            const averageRating = ratings.length > 0 ? ratings[0].averageRating : 0;
            return {
                id: item._id,
                title: item.title,
                genre: genre,
                posterImage: item.posterImage,
                averageRating: averageRating,
            };
        }));
        const topRatedMovies = await this.ratingModel
            .aggregate([
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
                $limit: 6,
            },
        ])
            .exec();
        getTopRatingDTO.ratingDTOHome = await Promise.all(topRatedMovies.map(async (item) => {
            const video = await this.movieModel.findOne({ _id: item._id }).exec();
            const genre = await this.fetchGenres(video.genreId);
            return {
                id: item._id,
                genre: genre,
                title: video.title,
                posterImage: video.posterImage,
                averageRating: item.averageRating,
                mpaRatings: video.mpaRatings,
            };
        }));
        jsonResponse.result = getTopRatingDTO;
        jsonResponse.message = status_constants_1.MESSAGES_CODE.GET_SUCCESS;
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
            throw new Error('Error fetching genres');
        }
    }
};
exports.TopRatedService = TopRatedService;
exports.TopRatedService = TopRatedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(video_schema_1.Video.name)),
    __param(1, (0, mongoose_1.InjectModel)(genre_schema_1.Genre.name)),
    __param(2, (0, mongoose_1.InjectModel)(rating_schema_1.Rating.name)),
    __metadata("design:paramtypes", [mongoose_2.default.Model, mongoose_2.default.Model, mongoose_2.default.Model])
], TopRatedService);
//# sourceMappingURL=top-rated.service.js.map