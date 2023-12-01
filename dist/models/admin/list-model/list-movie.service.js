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
exports.ListModelService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const video_schema_1 = require("../../../database/schemas/video.schema");
const favorite_schema_1 = require("../../../database/schemas/favorite.schema");
const rating_schema_1 = require("../../../database/schemas/rating.schema");
const genre_schema_1 = require("../../../database/schemas/genre.schema");
const cast_schema_1 = require("../../../database/schemas/cast.schema");
const fire_base_service_service_1 = require("../../base-repository/firebase/fire-base-service/fire-base-service.service");
const language_schema_1 = require("../../../database/schemas/language.schema");
const json_response_model_1 = require("./json-response.model");
const status_constants_1 = require("../../../Constant/status.constants");
const watchHistory_schema_1 = require("../../../database/schemas/watchHistory.schema");
let ListModelService = class ListModelService {
    constructor(movieModel, favoritesModel, ratingModel, genreModel, langugeModel, castModel, watchingHistoryModel, firebaseService) {
        this.movieModel = movieModel;
        this.favoritesModel = favoritesModel;
        this.ratingModel = ratingModel;
        this.genreModel = genreModel;
        this.langugeModel = langugeModel;
        this.castModel = castModel;
        this.watchingHistoryModel = watchingHistoryModel;
        this.firebaseService = firebaseService;
        this.pageSize = 9;
    }
    async FindAll(searchQuery, additionDate, sortbyView, sortByLike, sortByRating, pageNumber = 1) {
        const skipAmount = this.pageSize * (pageNumber - 1);
        const baseQuery = this.movieModel.find();
        if (searchQuery) {
            const titleRegex = new RegExp(searchQuery, 'i');
            baseQuery.or([{ title: titleRegex }, { genre: titleRegex }]);
        }
        baseQuery.sort({ additionDate: -1 });
        if (additionDate) {
            baseQuery.sort({ additionDate: 1 });
        }
        else if (sortbyView) {
            baseQuery.sort({ view: -1 });
        }
        const videoFilter = await baseQuery
            .skip(skipAmount)
            .limit(this.pageSize)
            .exec();
        const totalPage = Math.ceil((await this.movieModel.countDocuments()) / this.pageSize);
        const listProducts = await Promise.all(videoFilter.map(async (video) => {
            const ratings = await this.fetchRatings(video.id);
            console.log(ratings);
            const favorites = await this.fetchFavorites(video.id);
            const { averageRating, quality } = this.calculateAverageRating(ratings);
            const genreInfo = await this.fetchGenres(video.genreId);
            return {
                id: video.id,
                MPARatings: video.mpaRatings,
                title: video.title,
                duration: video.duration,
                posterImage: `${video.posterImage}`,
                view: video.view,
                additionDate: video.additionDate,
                rating: { rating: averageRating, quality },
                like: favorites.length,
                genre: genreInfo,
            };
        }));
        if (sortByLike) {
            listProducts.sort((a, b) => b.like - a.like);
        }
        else if (sortByRating) {
            listProducts.sort((a, b) => b.rating.rating - a.rating.rating);
        }
        return {
            data: listProducts,
            total: totalPage,
        };
    }
    async updateAMovie(id, modelRequest, files) {
        const jsonResponse = new json_response_model_1.JsonResponse(true);
        if (id === null) {
            return new common_1.NotFoundException(status_constants_1.MESSAGES_CODE.UPDATE_FAIL, 'id is reqiuired');
        }
        const video = await this.movieModel.findById(id).exec();
        if (!video) {
            return new common_1.NotFoundException(status_constants_1.MESSAGES_CODE.UPDATE_FAIL, 'Video not found');
        }
        try {
            video.title = modelRequest.title;
            video.duration = modelRequest.duration;
            video.content = modelRequest.content;
            video.mpaRatings = modelRequest.mpaRatings;
            video.country = modelRequest.country;
            video.releaseYear = modelRequest.releaseYear;
            video.additionDate = new Date();
            const genres = [];
            for (const i of modelRequest.genre) {
                const nameGenre = capitalizeFirstLetter(i.name);
                const existGenre = await this.genreModel
                    .findOne({ name: nameGenre })
                    .exec();
                if (!existGenre) {
                    const genreStore = new this.genreModel();
                    genreStore.name = nameGenre;
                    genres.push(genreStore);
                    video.genreId.push(genreStore._id.toString());
                }
            }
            const languages = [];
            for (const i of modelRequest.language) {
                const nameLanguage = capitalizeFirstLetter(i.title);
                const existLanguage = await this.langugeModel
                    .findOne({ title: nameLanguage })
                    .exec();
                if (!existLanguage) {
                    const languageStore = new this.langugeModel();
                    languageStore.title = nameLanguage;
                    languages.push(languageStore);
                    video.languageId.push(languageStore._id.toString());
                }
            }
            await this.firebaseService.updateFile(video.posterImage, files.posterImage[0]);
            await this.firebaseService.updateFile(video.movieLink, files.movieUrl[0]);
            await this.movieModel.updateMany({ _id: id }, video);
            await this.genreModel.create(genres);
            await this.langugeModel.create(languages);
            jsonResponse.result = video;
            jsonResponse.message = status_constants_1.MESSAGES_CODE.UPDATED_SUCCESS;
            return { jsonResponse };
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async addMovie(modelRequest, files) {
        const jsonResponse = new json_response_model_1.JsonResponse(true);
        try {
            const video = new this.movieModel({
                title: modelRequest.title,
                duration: modelRequest.duration,
                content: modelRequest.content,
                mpaRatings: modelRequest.mpaRatings,
                country: modelRequest.country,
                releaseYear: modelRequest.releaseYear,
                additionDate: new Date(),
                view: 0,
            });
            const genres = [];
            for (const i of modelRequest.genre) {
                const nameGenre = capitalizeFirstLetter(i.name);
                const existGenre = await this.genreModel
                    .findOne({ name: nameGenre })
                    .exec();
                if (existGenre) {
                    video.genreId.push((await existGenre)._id.toString());
                }
                else {
                    const genreStore = new this.genreModel();
                    genreStore.name = nameGenre;
                    genres.push(genreStore);
                    video.genreId.push(genreStore._id.toString());
                }
            }
            const languages = [];
            for (const i of modelRequest.language) {
                const nameLanguage = capitalizeFirstLetter(i.title);
                const existLanguage = await this.langugeModel
                    .findOne({ title: nameLanguage })
                    .exec();
                if (existLanguage) {
                    video.languageId.push((await existLanguage)._id.toString());
                }
                else {
                    const languageStore = new this.langugeModel();
                    languageStore.title = nameLanguage;
                    languages.push(languageStore);
                    video.languageId.push(languageStore._id.toString());
                }
            }
            const idImage = await this.firebaseService.upload(files.posterImage[0]);
            const idMovie = await this.firebaseService.upload(files.movieUrl[0]);
            video.posterImage = await idImage.result.name;
            video.movieLink = await idMovie.result.name;
            await this.movieModel.create(video);
            await this.genreModel.create(genres);
            await this.langugeModel.create(languages);
            jsonResponse.result = video;
            jsonResponse.message = status_constants_1.MESSAGES_CODE.CREATED_SUCCESS;
            return { jsonResponse };
        }
        catch (error) {
            jsonResponse.success = false;
            jsonResponse.results = error;
            jsonResponse.message = status_constants_1.MESSAGES_CODE.CREATE_FAIL;
            return { jsonResponse };
        }
    }
    async deleteAMovie(id, userId) {
        if (id === null) {
            return new common_1.NotFoundException(status_constants_1.MESSAGES_CODE.DELETE_FAIL, 'Video not found');
        }
        const value = await this.movieModel.findById(id).exec();
        if (!value) {
            return new common_1.NotFoundException(status_constants_1.MESSAGES_CODE.DELETE_FAIL, 'Video not found');
        }
        const deleteMovie = await this.movieModel.findByIdAndDelete(id).exec();
        if (deleteMovie !== null) {
            await this.firebaseService.deleteFile(deleteMovie.posterImage);
            await this.firebaseService.deleteFile(deleteMovie.movieLink);
            const videoId = deleteMovie._id.toString();
            await this.watchingHistoryModel
                .deleteOne({ videoId: videoId, userId: userId })
                .exec();
            const deleteRating = await this.ratingModel
                .find({ videoId: videoId })
                .exec();
            if (deleteRating.length > 0) {
                for (const i of deleteRating) {
                    await this.ratingModel.findByIdAndDelete(i._id).exec();
                }
            }
        }
        return status_constants_1.MESSAGES_CODE.DELETED_SUCCESS;
    }
    async deleteListMovie(idList, userId) {
        if (idList.length === 0) {
            return new common_1.NotFoundException(status_constants_1.MESSAGES_CODE.DELETE_FAIL, 'Video not found');
        }
        let video;
        for (const id of idList) {
            video = this.deleteAMovie(id, userId);
        }
        return video;
    }
    async fetchRatings(videoId) {
        try {
            const ratings = await this.ratingModel.find({ videoId: videoId }).exec();
            return ratings;
        }
        catch (error) {
            throw new Error('Error fetching ratings');
        }
    }
    async fetchFavorites(videoId) {
        try {
            const favorites = await this.favoritesModel
                .find({ videoId: videoId })
                .exec();
            return favorites;
        }
        catch (error) {
            throw new Error('Error fetching favorites');
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
    calculateAverageRating(ratings) {
        if (!ratings || ratings.length === 0) {
            return { averageRating: 0, quality: 0 };
        }
        let totalRating = 0;
        let totalQuality = 0;
        for (const rating of ratings) {
            totalRating += rating.value;
            totalQuality++;
        }
        const averageRating = totalRating / totalQuality;
        return { averageRating, quality: totalQuality };
    }
};
exports.ListModelService = ListModelService;
exports.ListModelService = ListModelService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(video_schema_1.Video.name)),
    __param(1, (0, mongoose_1.InjectModel)(favorite_schema_1.Favorites.name)),
    __param(2, (0, mongoose_1.InjectModel)(rating_schema_1.Rating.name)),
    __param(3, (0, mongoose_1.InjectModel)(genre_schema_1.Genre.name)),
    __param(4, (0, mongoose_1.InjectModel)(language_schema_1.Language.name)),
    __param(5, (0, mongoose_1.InjectModel)(cast_schema_1.Cast.name)),
    __param(6, (0, mongoose_1.InjectModel)(watchHistory_schema_1.WatchHistory.name)),
    __metadata("design:paramtypes", [mongoose_2.default.Model, mongoose_2.default.Model, mongoose_2.default.Model, mongoose_2.default.Model, mongoose_2.default.Model, mongoose_2.default.Model, mongoose_2.default.Model, fire_base_service_service_1.FireBaseService])
], ListModelService);
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
//# sourceMappingURL=list-movie.service.js.map