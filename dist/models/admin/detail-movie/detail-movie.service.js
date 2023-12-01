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
exports.DetailMovieService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const favorite_schema_1 = require("../../../database/schemas/favorite.schema");
const genre_schema_1 = require("../../../database/schemas/genre.schema");
const rating_schema_1 = require("../../../database/schemas/rating.schema");
const video_schema_1 = require("../../../database/schemas/video.schema");
const language_schema_1 = require("../../../database/schemas/language.schema");
const list_movie_service_1 = require("../list-model/list-movie.service");
const status_constants_1 = require("../../../Constant/status.constants");
const watchHistory_schema_1 = require("../../../database/schemas/watchHistory.schema");
let DetailMovieService = class DetailMovieService {
    constructor(movieModel, favoritesModel, ratingModel, genreModel, languageModel, watchHistoryModel, listModelService) {
        this.movieModel = movieModel;
        this.favoritesModel = favoritesModel;
        this.ratingModel = ratingModel;
        this.genreModel = genreModel;
        this.languageModel = languageModel;
        this.watchHistoryModel = watchHistoryModel;
        this.listModelService = listModelService;
    }
    async getDetailMovie(videoId) {
        const video = await this.movieModel.findOne({ _id: videoId }).exec();
        if (video) {
            const genreInfo = await this.fetchGenres(video.genreId);
            const languageInfo = await this.fetchLanguages(video.languageId);
            const ratingInfo = await this.ratingModel.find({ videoId: video.id });
            const favoritesInfo = await this.favoritesModel.find({
                videoId: video.id,
            });
            const aNumberOfLike = favoritesInfo.length;
            let valueRating = 0;
            for (const rating of ratingInfo) {
                valueRating += rating.value;
            }
            const totalRating = valueRating / ratingInfo.length;
            const getdetailMovie = {
                id: video._id,
                title: video.title,
                releaseYear: video.releaseYear,
                duration: video.duration,
                posterImage: video.posterImage,
                movieLink: video.movieLink,
                view: video.view,
                rating: totalRating,
                mpaRatings: video.mpaRatings,
                content: video.content,
                country: video.country,
                like: aNumberOfLike,
                additionDate: video.additionDate,
                genre: genreInfo,
                language: languageInfo,
            };
            return getdetailMovie;
        }
        else {
            return new common_1.NotFoundException(status_constants_1.MESSAGES_CODE.GET_FAIL, 'Video not found');
        }
    }
    async deleteAMovie(videoId, userId) {
        const deleteMovie = await this.listModelService.deleteAMovie(videoId, userId);
        return deleteMovie;
    }
    async updateAMovie(id, modelRequest, files) {
        const update = await this.listModelService.updateAMovie(id, modelRequest, files);
        return update;
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
    async fetchLanguages(language) {
        try {
            const listLanguage = [];
            for (const models of language) {
                const languages = await this.languageModel
                    .findById({ _id: models })
                    .exec();
                listLanguage.push(languages);
            }
            return listLanguage;
        }
        catch (error) {
            throw new Error('Error fetching favorites');
        }
    }
};
exports.DetailMovieService = DetailMovieService;
exports.DetailMovieService = DetailMovieService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(video_schema_1.Video.name)),
    __param(1, (0, mongoose_1.InjectModel)(favorite_schema_1.Favorites.name)),
    __param(2, (0, mongoose_1.InjectModel)(rating_schema_1.Rating.name)),
    __param(3, (0, mongoose_1.InjectModel)(genre_schema_1.Genre.name)),
    __param(4, (0, mongoose_1.InjectModel)(language_schema_1.Language.name)),
    __param(5, (0, mongoose_1.InjectModel)(watchHistory_schema_1.WatchHistory.name)),
    __metadata("design:paramtypes", [mongoose_2.default.Model, mongoose_2.default.Model, mongoose_2.default.Model, mongoose_2.default.Model, mongoose_2.default.Model, mongoose_2.default.Model, list_movie_service_1.ListModelService])
], DetailMovieService);
//# sourceMappingURL=detail-movie.service.js.map