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
import { ModelModule } from './models/base-repository/Movie/model.module';
import { ModelService } from './models/base-repository/Movie/model.service';
import { FireBaseService } from './models/base-repository/firebase/fire-base-service/fire-base-service.service';

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
    ModelModule,
  ],
  controllers: [],
  providers: [ModelService, FireBaseService],
})
export class AppModule {}
