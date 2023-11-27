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
exports.DetailMovieController = void 0;
const common_1 = require("@nestjs/common");
const detail_movie_service_1 = require("./detail-movie.service");
const mongodb_1 = require("mongodb");
const platform_express_1 = require("@nestjs/platform-express");
const Movie_model_1 = require("../list-model/dto/Movie.model");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorator/roles.decorator");
let DetailMovieController = class DetailMovieController {
    constructor(detailMovie) {
        this.detailMovie = detailMovie;
    }
    async getDetailMovie(id) {
        return await this.detailMovie.getDetailMovie(id);
    }
    async deleteMovie(id) {
        const objectId = new mongodb_1.ObjectId(id);
        const deleteMovie = await this.detailMovie.deleteAMovie(objectId);
        return deleteMovie;
    }
    async updateMovie(id, modelRequest, files) {
        const objectId = new mongodb_1.ObjectId(id);
        const addMovie = await this.detailMovie.updateAMovie(objectId, modelRequest, files);
        return addMovie;
    }
};
exports.DetailMovieController = DetailMovieController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('Admin'),
    __param(0, (0, common_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DetailMovieController.prototype, "getDetailMovie", null);
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('Admin'),
    __param(0, (0, common_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DetailMovieController.prototype, "deleteMovie", null);
__decorate([
    (0, common_1.Put)('/updateMovie'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'posterImage', maxCount: 1 },
        { name: 'movieUrl', maxCount: 1 },
    ])),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Movie_model_1.MovieRes, Object]),
    __metadata("design:returntype", Promise)
], DetailMovieController.prototype, "updateMovie", null);
exports.DetailMovieController = DetailMovieController = __decorate([
    (0, common_1.Controller)('detail-movie'),
    __metadata("design:paramtypes", [detail_movie_service_1.DetailMovieService])
], DetailMovieController);
//# sourceMappingURL=detail-movie.controller.js.map