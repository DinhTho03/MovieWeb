import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { DetailMovieService } from './detail-movie.service';
import { ObjectId } from 'mongodb';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MovieRes } from '../list-model/dto/Movie.model';

@Controller('detail-movie')
export class DetailMovieController {
  constructor(private detailMovie: DetailMovieService) {}
  @Get()
  async getDetailMovie(@Query('id') id: string) {
    return await this.detailMovie.getDetailMovie(id);
  }
  @Delete()
  async deleteMovie(@Query('id') id: string) {
    const objectId = new (ObjectId as any)(id);
    const deleteMovie = await this.detailMovie.deleteAMovie(objectId);
    return deleteMovie;
  }

  // Update movie
  @Put('/updateMovie')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'posterImage', maxCount: 1 },
      { name: 'movieUrl', maxCount: 1 },
      { name: 'avatar', maxCount: 10 },
    ]),
  )
  @HttpCode(200)
  async updateMovie(
    @Body() id: string,
    @Body() modelRequest: MovieRes,
    @UploadedFiles() files,
  ) {
    // Convert string to ObjectId
    const objectId = new (ObjectId as any)(id);
    const addMovie = await this.detailMovie.updateAMovie(
      objectId,
      modelRequest,
      files,
    );
    return addMovie;
  }
}
