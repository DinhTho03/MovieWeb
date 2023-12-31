import { Module } from '@nestjs/common';
import { DetailMovieService } from './detail-movie.service';
import { DetailMovieController } from './detail-movie.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Video, VideoSchema } from 'src/database/schemas/video.schema';
import {
  Favorites,
  FavoritesSchema,
} from 'src/database/schemas/favorite.schema';
import { Rating, RatingSchema } from 'src/database/schemas/rating.schema';
import { Genre } from 'src/database/schemas/genre.schema';
import { Cast, CastSchema } from 'src/database/schemas/cast.schema';
import { Language, LanguageSchema } from 'src/database/schemas/language.schema';
import { ListModelService } from '../list-model/list-movie.service';
import { FireBaseService } from 'src/models/base-repository/firebase/fire-base-service/fire-base-service.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  WatchHistory,
  WatchHistorySchema,
} from 'src/database/schemas/watchHistory.schema';

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
      { name: Video.name, schema: VideoSchema },
      { name: Favorites.name, schema: FavoritesSchema },
      { name: Rating.name, schema: RatingSchema }, // Sử dụng Video.name thay vì 'Video'
      { name: Genre.name, schema: RatingSchema },
      { name: Cast.name, schema: CastSchema },
      { name: Language.name, schema: LanguageSchema },
      { name: WatchHistory.name, schema: WatchHistorySchema },
    ]),
  ],
  providers: [DetailMovieService, ListModelService, FireBaseService],
  controllers: [DetailMovieController],
})
export class DetailMovieModule {}
