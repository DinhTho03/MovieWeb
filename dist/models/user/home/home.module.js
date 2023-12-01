"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeModule = void 0;
const common_1 = require("@nestjs/common");
const home_controller_1 = require("./home.controller");
const home_service_1 = require("./home.service");
const mongoose_1 = require("@nestjs/mongoose");
const cast_schema_1 = require("../../../database/schemas/cast.schema");
const genre_schema_1 = require("../../../database/schemas/genre.schema");
const video_schema_1 = require("../../../database/schemas/video.schema");
const rating_schema_1 = require("../../../database/schemas/rating.schema");
const watchHistory_schema_1 = require("../../../database/schemas/watchHistory.schema");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const favorite_schema_1 = require("../../../database/schemas/favorite.schema");
let HomeModule = class HomeModule {
};
exports.HomeModule = HomeModule;
exports.HomeModule = HomeModule = __decorate([
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
                { name: cast_schema_1.Cast.name, schema: cast_schema_1.CastSchema },
                { name: genre_schema_1.Genre.name, schema: genre_schema_1.GenreSchema },
                { name: rating_schema_1.Rating.name, schema: rating_schema_1.RatingSchema },
                { name: watchHistory_schema_1.WatchHistory.name, schema: watchHistory_schema_1.WatchHistorySchema },
                { name: favorite_schema_1.Favorites.name, schema: favorite_schema_1.FavoritesSchema },
            ]),
        ],
        controllers: [home_controller_1.HomeController],
        providers: [home_service_1.HomeService],
    })
], HomeModule);
//# sourceMappingURL=home.module.js.map