import { Controller, Delete, Get, Query } from '@nestjs/common';
import { DetailMovieService } from './detail-movie.service';
import { ObjectId } from 'mongodb';

@Controller('detail-movie')
export class DetailMovieController {
  constructor(private detailMovie: DetailMovieService) {}
  @Get()
  async getDetailMovie(@Query('id') id: string) {
    return await this.detailMovie.getDetailMovie(id);
  }
  @Delete()
  async DeleteMovie(@Query('id') id: string) {
    const objectId = new ObjectId(id); // Convert the string to ObjectId
    return await this.detailMovie.deleteAMovie(objectId);
  }
}
