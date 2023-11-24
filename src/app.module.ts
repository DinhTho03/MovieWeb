// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GenreSchema } from './database/schemas/genre.schema';
import { CastSchema } from './database/schemas/cast.schema';
import { FavoritesSchema } from './database/schemas/favorite.schema';
import { RatingSchema } from './database/schemas/rating.schema';
import { RecentSearchesSchema } from './database/schemas/recent_Searches.schema';
import { RoleSchema } from './database/schemas/role.schema';
import { UserSchema } from './database/schemas/user.schema';
import { WatchHistorySchema } from './database/schemas/watchHistory.schema';
import { VideoSchema } from './database/schemas/video.schema';
import { LanguageSchema } from './database/schemas/language.schema';
import { ListModelModule } from './models/admin/list-model/list-movie.module';
import { DetailMovieModule } from './models/admin/detail-movie/detail-movie.module';
import { FireBaseService } from './models/base-repository/firebase/fire-base-service/fire-base-service.service';
import { VideoplayService } from './models/user/videoplay/videoplay.service';
import { VideoplayController } from './models/user/videoplay/videoplay.controller';
import { VideoplayModule } from './models/user/videoplay/videoplay.module';
import { HomeModule } from './models/user/home/home.module';
import { AuthService } from './models/auth/auth.service';
import { AuthController } from './models/auth/auth.controller';
import { AuthModule } from './models/auth/auth.module';
// import { APP_GUARD } from '@nestjs/core';
// import { JwtAuthGuard } from './models/auth/strategies/auth.guard';
import { TopRatedController } from './models/user/top-rated/top-rated.controller';
import { TopRatedModule } from './models/user/top-rated/top-rated.module';
import { TopRatedService } from './models/user/top-rated/top-rated.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    MongooseModule.forFeature([
      { name: 'Genre', schema: GenreSchema },
      { name: 'Cast', schema: CastSchema },
      { name: 'Favorites', schema: FavoritesSchema },
      { name: 'Rating', schema: RatingSchema },
      { name: 'RecentSearches', schema: RecentSearchesSchema },
      { name: 'Role', schema: RoleSchema },
      { name: 'User', schema: UserSchema },
      { name: 'WatchHistory', schema: WatchHistorySchema },
      { name: 'Video', schema: VideoSchema },
      { name: 'Language', schema: LanguageSchema },
    ]),
    ListModelModule,
    DetailMovieModule,
    VideoplayModule,
    HomeModule,
    AuthModule,
    TopRatedModule,
  ],
  controllers: [VideoplayController, AuthController, TopRatedController],
  providers: [
    FireBaseService,
    VideoplayService,
    AuthService,
    TopRatedService,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
})
export class AppModule {}
