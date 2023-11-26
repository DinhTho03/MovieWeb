"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopRatedModule = void 0;
const common_1 = require("@nestjs/common");
const top_rated_service_1 = require("./top-rated.service");
const top_rated_controller_1 = require("./top-rated.controller");
const video_schema_1 = require("../../../database/schemas/video.schema");
const mongoose_1 = require("@nestjs/mongoose");
const rating_schema_1 = require("../../../database/schemas/rating.schema");
const genre_schema_1 = require("../../../database/schemas/genre.schema");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let TopRatedModule = class TopRatedModule {
};
exports.TopRatedModule = TopRatedModule;
exports.TopRatedModule = TopRatedModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET', 'ProJect_StreamAPI'),
                    signOptions: { expiresIn: '1h' },
                }),
                inject: [config_1.ConfigService],
            }),
            mongoose_1.MongooseModule.forFeature([
                { name: video_schema_1.Video.name, schema: video_schema_1.VideoSchema },
                { name: genre_schema_1.Genre.name, schema: genre_schema_1.GenreSchema },
                { name: rating_schema_1.Rating.name, schema: rating_schema_1.RatingSchema },
            ]),
        ],
        controllers: [top_rated_controller_1.TopRatedController],
        providers: [top_rated_service_1.TopRatedService],
    })
], TopRatedModule);
//# sourceMappingURL=top-rated.module.js.map