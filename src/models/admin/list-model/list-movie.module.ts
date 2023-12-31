import { Module } from '@nestjs/common';
import { ListModelController } from './list-movie.controller';
import { ListModelService } from './list-movie.service';
import { Video, VideoSchema } from 'src/database/schemas/video.schema';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Favorites,
  FavoritesSchema,
} from 'src/database/schemas/favorite.schema';
import { Rating, RatingSchema } from 'src/database/schemas/rating.schema';
import { Genre, GenreSchema } from 'src/database/schemas/genre.schema';
import { FireBaseService } from 'src/models/base-repository/firebase/fire-base-service/fire-base-service.service';
import { Language, LanguageSchema } from 'src/database/schemas/language.schema';
import { Cast, CastSchema } from 'src/database/schemas/cast.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  WatchHistory,
  WatchHistorySchema,
} from 'src/database/schemas/watchHistory.schema';
// import { Rating, RatingSchema } from 'src/database/schemas/rating.schema';
// import {
//   Favorites,
//   FavoritesSchema,
// } from 'src/database/schemas/favorite.schema';
// import { Genre, GenreSchema } from 'src/database/schemas/genre.schema';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'ProJect_StreamAPI'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Video.name, schema: VideoSchema }, // Sử dụng Video.name thay vì 'Video'
      { name: Favorites.name, schema: FavoritesSchema },
      { name: Rating.name, schema: RatingSchema },
      { name: Genre.name, schema: GenreSchema },
      { name: Language.name, schema: LanguageSchema },
      { name: Cast.name, schema: CastSchema },
      { name: WatchHistory.name, schema: WatchHistorySchema },
    ]),
  ],
  controllers: [ListModelController],
  providers: [ListModelService, FireBaseService],
})
export class ListModelModule {}
