import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cast, CastSchema } from 'src/database/schemas/cast.schema';
import { Genre, GenreSchema } from 'src/database/schemas/genre.schema';
import { Video, VideoSchema } from 'src/database/schemas/video.schema';
import { VideoplayController } from './videoplay.controller';
import { VideoplayService } from './videoplay.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
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
      { name: Cast.name, schema: CastSchema },
      { name: Genre.name, schema: GenreSchema },
      { name: WatchHistory.name, schema: WatchHistorySchema },
    ]),
  ],
  controllers: [VideoplayController],
  providers: [VideoplayService],
})
export class VideoplayModule {}
