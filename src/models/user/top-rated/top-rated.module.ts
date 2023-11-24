import { Module } from '@nestjs/common';
import { TopRatedService } from './top-rated.service';
import { TopRatedController } from './top-rated.controller';
import { Video, VideoSchema } from 'src/database/schemas/video.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Rating, RatingSchema } from 'src/database/schemas/rating.schema';
import { Genre, GenreSchema } from 'src/database/schemas/genre.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
      { name: Genre.name, schema: GenreSchema },
      { name: Rating.name, schema: RatingSchema },
    ]),
  ],
  controllers: [TopRatedController],
  providers: [TopRatedService],
})
export class TopRatedModule {}
