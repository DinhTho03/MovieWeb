"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const genre_schema_1 = require("./database/schemas/genre.schema");
const cast_schema_1 = require("./database/schemas/cast.schema");
const favorite_schema_1 = require("./database/schemas/favorite.schema");
const rating_schema_1 = require("./database/schemas/rating.schema");
const recent_Searches_schema_1 = require("./database/schemas/recent_Searches.schema");
const role_schema_1 = require("./database/schemas/role.schema");
const user_schema_1 = require("./database/schemas/user.schema");
const watchHistory_schema_1 = require("./database/schemas/watchHistory.schema");
const video_schema_1 = require("./database/schemas/video.schema");
const language_schema_1 = require("./database/schemas/language.schema");
const list_movie_module_1 = require("./models/admin/list-model/list-movie.module");
const detail_movie_module_1 = require("./models/admin/detail-movie/detail-movie.module");
const fire_base_service_service_1 = require("./models/base-repository/firebase/fire-base-service/fire-base-service.service");
const videoplay_service_1 = require("./models/user/videoplay/videoplay.service");
const videoplay_controller_1 = require("./models/user/videoplay/videoplay.controller");
const videoplay_module_1 = require("./models/user/videoplay/videoplay.module");
const home_module_1 = require("./models/user/home/home.module");
const auth_service_1 = require("./models/auth/auth.service");
const auth_controller_1 = require("./models/auth/auth.controller");
const auth_module_1 = require("./models/auth/auth.module");
const top_rated_controller_1 = require("./models/user/top-rated/top-rated.controller");
const top_rated_module_1 = require("./models/user/top-rated/top-rated.module");
const top_rated_service_1 = require("./models/user/top-rated/top-rated.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: '.env',
                isGlobal: true,
            }),
            mongoose_1.MongooseModule.forRoot(process.env.DB_URI),
            mongoose_1.MongooseModule.forFeature([
                { name: 'Genre', schema: genre_schema_1.GenreSchema },
                { name: 'Cast', schema: cast_schema_1.CastSchema },
                { name: 'Favorites', schema: favorite_schema_1.FavoritesSchema },
                { name: 'Rating', schema: rating_schema_1.RatingSchema },
                { name: 'RecentSearches', schema: recent_Searches_schema_1.RecentSearchesSchema },
                { name: 'Role', schema: role_schema_1.RoleSchema },
                { name: 'User', schema: user_schema_1.UserSchema },
                { name: 'WatchHistory', schema: watchHistory_schema_1.WatchHistorySchema },
                { name: 'Video', schema: video_schema_1.VideoSchema },
                { name: 'Language', schema: language_schema_1.LanguageSchema },
            ]),
            list_movie_module_1.ListModelModule,
            detail_movie_module_1.DetailMovieModule,
            videoplay_module_1.VideoplayModule,
            home_module_1.HomeModule,
            auth_module_1.AuthModule,
            top_rated_module_1.TopRatedModule,
        ],
        controllers: [videoplay_controller_1.VideoplayController, auth_controller_1.AuthController, top_rated_controller_1.TopRatedController],
        providers: [
            fire_base_service_service_1.FireBaseService,
            videoplay_service_1.VideoplayService,
            auth_service_1.AuthService,
            top_rated_service_1.TopRatedService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map