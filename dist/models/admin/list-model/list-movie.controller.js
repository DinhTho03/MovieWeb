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
var ListModelController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListModelController = void 0;
const common_1 = require("@nestjs/common");
const list_movie_service_1 = require("./list-movie.service");
const mongodb_1 = require("mongodb");
const fire_base_service_service_1 = require("../../base-repository/firebase/fire-base-service/fire-base-service.service");
const Movie_model_1 = require("./dto/Movie.model");
const platform_express_1 = require("@nestjs/platform-express");
const roles_decorator_1 = require("../../auth/decorator/roles.decorator");
const roles_guard_1 = require("../../auth/guards/roles.guard");
let ListModelController = ListModelController_1 = class ListModelController {
    constructor(listModelService, firebaseService) {
        this.listModelService = listModelService;
        this.firebaseService = firebaseService;
        this.logger = new common_1.Logger(ListModelController_1.name);
    }
    async findAll(searchQuery, additionDate, sortbyView, sortByLike, sortByRating, pageNumber = 1) {
        return await this.listModelService.FindAll(searchQuery, additionDate, sortbyView, sortByLike, sortByRating, pageNumber);
    }
    async deleteAMovie(id) {
        const objectId = new mongodb_1.ObjectId(id);
        const deleteMovie = await this.listModelService.deleteAMovie(objectId);
        return deleteMovie;
    }
    async deleteListMovie(ids) {
        console.log(ids);
        const objectIdList = ids.map((id) => new mongodb_1.ObjectId(id));
        const deleteListMovie = await this.listModelService.deleteListMovie(objectIdList);
        return deleteListMovie;
    }
    async addMovie(modelRequest, files) {
        console.log(modelRequest);
        console.log(files.posterImage[0]);
        const addMovie = await this.listModelService.addMovie(modelRequest, files);
        return addMovie;
    }
    async updateMovie(id, modelRequest, files) {
        const objectId = new mongodb_1.ObjectId(id);
        const addMovie = await this.listModelService.updateAMovie(objectId, modelRequest, files);
        return addMovie;
    }
    async addCast(files) {
        console.log(files);
        return true;
    }
};
exports.ListModelController = ListModelController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('Admin'),
    __param(0, (0, common_1.Query)('searchQuery')),
    __param(1, (0, common_1.Query)('additionDate')),
    __param(2, (0, common_1.Query)('sortbyView')),
    __param(3, (0, common_1.Query)('sortByLike')),
    __param(4, (0, common_1.Query)('sortByRating')),
    __param(5, (0, common_1.Query)('pageNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean, Boolean, Boolean, Boolean, Number]),
    __metadata("design:returntype", Promise)
], ListModelController.prototype, "findAll", null);
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('Admin'),
    __param(0, (0, common_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ListModelController.prototype, "deleteAMovie", null);
__decorate([
    (0, common_1.Delete)('/deleteListMovie'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('Admin'),
    __param(0, (0, common_1.Body)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], ListModelController.prototype, "deleteListMovie", null);
__decorate([
    (0, common_1.Post)('/addMovie'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'posterImage', maxCount: 1 },
        { name: 'movieUrl', maxCount: 1 },
    ])),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Movie_model_1.MovieRes, Object]),
    __metadata("design:returntype", Promise)
], ListModelController.prototype, "addMovie", null);
__decorate([
    (0, common_1.Put)('/updateMovie'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'posterImage', maxCount: 1 },
        { name: 'movieUrl', maxCount: 1 },
        { name: 'avatar', maxCount: 10 },
    ])),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Movie_model_1.MovieRes, Object]),
    __metadata("design:returntype", Promise)
], ListModelController.prototype, "updateMovie", null);
__decorate([
    (0, common_1.Post)('/upload'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([{ name: 'movieUrl', maxCount: 1 }])),
    __param(0, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ListModelController.prototype, "addCast", null);
exports.ListModelController = ListModelController = ListModelController_1 = __decorate([
    (0, common_1.Controller)('list-model'),
    __metadata("design:paramtypes", [list_movie_service_1.ListModelService,
        fire_base_service_service_1.FireBaseService])
], ListModelController);
//# sourceMappingURL=list-movie.controller.js.map