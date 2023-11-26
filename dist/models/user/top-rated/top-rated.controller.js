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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopRatedController = void 0;
const common_1 = require("@nestjs/common");
const top_rated_service_1 = require("./top-rated.service");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorator/roles.decorator");
let TopRatedController = class TopRatedController {
    constructor(topRatedService) {
        this.topRatedService = topRatedService;
    }
    async getTopRated() {
        return await this.topRatedService.getTopRated();
    }
};
exports.TopRatedController = TopRatedController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('Admin', 'User'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TopRatedController.prototype, "getTopRated", null);
exports.TopRatedController = TopRatedController = __decorate([
    (0, common_1.Controller)('top-rated'),
    __metadata("design:paramtypes", [top_rated_service_1.TopRatedService])
], TopRatedController);
//# sourceMappingURL=top-rated.controller.js.map