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
import { ModelService } from 'src/models/model/model.service';
// import { Rating, RatingSchema } from 'src/database/schemas/rating.schema';
// import {
//   Favorites,
//   FavoritesSchema,
// } from 'src/database/schemas/favorite.schema';
// import { Genre, GenreSchema } from 'src/database/schemas/genre.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Video.name, schema: VideoSchema }, // Sử dụng Video.name thay vì 'Video'
      { name: Favorites.name, schema: FavoritesSchema },
      { name: Rating.name, schema: RatingSchema },
      { name: Genre.name, schema: GenreSchema },
    ]),
  ],
  controllers: [ListModelController],
  providers: [ListModelService, ModelService],
})
export class ListModelModule {}
