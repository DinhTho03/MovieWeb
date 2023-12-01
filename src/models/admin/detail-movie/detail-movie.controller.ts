import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { DetailMovieService } from './detail-movie.service';
import { ObjectId } from 'mongodb';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MovieRes } from '../list-model/dto/Movie.model';
import { RolesGuard } from 'src/models/auth/guards/roles.guard';
import { Roles } from 'src/models/auth/decorator/roles.decorator';

@Controller('detail-movie')
export class DetailMovieController {
  constructor(private detailMovie: DetailMovieService) {}
  @Get()
  @UseGuards(RolesGuard)
  @Roles('Admin')
  async getDetailMovie(@Query('id') id: string) {
    return await this.detailMovie.getDetailMovie(id);
  }
  @Delete()
  @UseGuards(RolesGuard)
  @Roles('Admin')
  async deleteMovie(@Query('id') id: string, @Request() req) {
    const objectId = new (ObjectId as any)(id);
    const userId = req.user.id;
    const deleteMovie = await this.detailMovie.deleteAMovie(objectId, userId);
    return deleteMovie;
  }

  // Update movie
  @Put('/updateMovie')
  @UseGuards(RolesGuard)
  @Roles('Admin')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'posterImage', maxCount: 1 },
      { name: 'movieUrl', maxCount: 1 },
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
