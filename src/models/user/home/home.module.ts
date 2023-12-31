import { Module } from '@nestjs/common';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Cast, CastSchema } from 'src/database/schemas/cast.schema';
import { Genre, GenreSchema } from 'src/database/schemas/genre.schema';
import { Video, VideoSchema } from 'src/database/schemas/video.schema';
import { Rating, RatingSchema } from 'src/database/schemas/rating.schema';
import {
  WatchHistory,
  WatchHistorySchema,
} from 'src/database/schemas/watchHistory.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import {
  Favorites,
  FavoritesSchema,
} from 'src/database/schemas/favorite.schema';
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
      { name: Cast.name, schema: CastSchema },
      { name: Genre.name, schema: GenreSchema },
      { name: Rating.name, schema: RatingSchema },
      { name: WatchHistory.name, schema: WatchHistorySchema },
      { name: Favorites.name, schema: FavoritesSchema },
    ]),
  ],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
