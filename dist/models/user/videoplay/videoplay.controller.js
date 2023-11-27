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
exports.VideoplayController = void 0;
const common_1 = require("@nestjs/common");
const videoplay_service_1 = require("./videoplay.service");
const roles_decorator_1 = require("../../auth/decorator/roles.decorator");
const roles_guard_1 = require("../../auth/guards/roles.guard");
let VideoplayController = class VideoplayController {
    constructor(videoplayService) {
        this.videoplayService = videoplayService;
    }
    async findVideoPlay(id, req) {
        const userId = req.user.id;
        return await this.videoplayService.getVideoPlay(id, userId);
    }
    async likeVideoPlay(videoId, like, req) {
        const userId = req.user.id;
        return await this.videoplayService.likeVideoPlay(videoId, userId, like);
    }
    async ratingVideoPlay(videoId, rate, req) {
        const userId = req.user.id;
        return await this.videoplayService.ratingVideoPlay(videoId, userId, rate);
    }
};
exports.VideoplayController = VideoplayController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('User', 'Admin'),
    __param(0, (0, common_1.Query)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VideoplayController.prototype, "findVideoPlay", null);
__decorate([
    (0, common_1.Get)('/like'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('User', 'Admin'),
    __param(0, (0, common_1.Query)('videoId')),
    __param(1, (0, common_1.Query)('like')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean, Object]),
    __metadata("design:returntype", Promise)
], VideoplayController.prototype, "likeVideoPlay", null);
__decorate([
    (0, common_1.Post)('/rating'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('User', 'Admin'),
    __param(0, (0, common_1.Query)('videoId')),
    __param(1, (0, common_1.Query)('rate')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", Promise)
], VideoplayController.prototype, "ratingVideoPlay", null);
exports.VideoplayController = VideoplayController = __decorate([
    (0, common_1.Controller)('videoplay'),
    __metadata("design:paramtypes", [videoplay_service_1.VideoplayService])
], VideoplayController);
//# sourceMappingURL=videoplay.controller.js.map