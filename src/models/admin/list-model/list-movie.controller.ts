/* eslint-disable @typescript-eslint/no-var-requires */
import {
  Delete,
  Get,
  Controller,
  Query,
  Body,
  HttpCode,
  Post,
  UseInterceptors,
  UploadedFiles,
  Logger,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ListModelService } from './list-movie.service';
import { ObjectId } from 'mongodb';
import { FireBaseService } from 'src/models/base-repository/firebase/fire-base-service/fire-base-service.service';
import { MovieRes } from './dto/Movie.model';
import {
  FileFieldsInterceptor,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  FilesInterceptor,
} from '@nestjs/platform-express';
import { Roles } from 'src/models/auth/decorator/roles.decorator';
import { RolesGuard } from 'src/models/auth/guards/roles.guard';
import { TestAPI } from './dto/genre.Dto';
// import { JwtAuthGuard } from 'src/models/auth/strategies/auth.guard';
// import { RolesGuard } from 'src/models/auth/strategies/roles.guard';
// import { Roles } from 'src/models/auth/strategies/roles.decorator';

@Controller('list-model')
export class ListModelController {
  private readonly logger = new Logger(ListModelController.name);
  constructor(
    private listModelService: ListModelService,
    private firebaseService: FireBaseService,
  ) {}

  // Get all movie
  @Get()
  @UseGuards(RolesGuard)
  @Roles('Admin')
  async findAll(
    @Query('searchQuery') searchQuery: string,
    @Query('additionDate') additionDate: boolean | undefined,
    @Query('sortbyView') sortbyView: boolean | undefined,
    @Query('sortByLike') sortByLike: boolean | undefined,
    @Query('sortByRating') sortByRating: boolean | undefined,
    @Query('pageNumber') pageNumber: number = 1,
  ) {
    return await this.listModelService.FindAll(
      searchQuery,
      additionDate,
      sortbyView,
      sortByLike,
      sortByRating,
      pageNumber,
    );
  }

  // Delete a movie
  @Delete()
  @UseGuards(RolesGuard)
  @Roles('Admin')
  async deleteAMovie(@Query('id') id: string, @Request() req) {
    // Convert string to ObjectId
    const objectId = new (ObjectId as any)(id);
    const userId = req.user.id;
    const deleteMovie = await this.listModelService.deleteAMovie(
      objectId,
      userId,
    );
    return deleteMovie;
  }

  // Delete list movie
  @Delete('/deleteListMovie')
  @UseGuards(RolesGuard)
  @Roles('Admin')
  async deleteListMovie(@Body('ids') ids: string[], @Request() req) {
    // Convert string to ObjectId
    console.log(ids);
    const userId = req.user.id;
    const objectIdList = ids.map((id) => new (ObjectId as any)(id));
    const deleteListMovie = await this.listModelService.deleteListMovie(
      objectIdList,
      userId,
    );
    return deleteListMovie;
  }

  // Add movie
  @Post('/addMovie')
  @UseGuards(RolesGuard)
  @Roles('Admin')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'posterImage', maxCount: 1 },
      { name: 'movieUrl', maxCount: 1 },
    ]),
  )
  @HttpCode(200)
  async addMovie(@Body() modelRequest: MovieRes, @UploadedFiles() files) {
    console.log(modelRequest);
    console.log(files.posterImage[0]);
    console.log(files.movieUrl[0]);
    const addMovie = await this.listModelService.addMovie(modelRequest, files);

    return addMovie;
  }

  // Update movie
  @Put('/updateMovie')
  @UseGuards(RolesGuard)
  @Roles('Admin')
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
    const addMovie = await this.listModelService.updateAMovie(
      objectId,
      modelRequest,
      files,
    );
    return addMovie;
  }
  @Post('/upload')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'files', maxCount: 1 },
      { name: 'movies', maxCount: 1 },
    ]),
  )
  async addCast(@Body() test: TestAPI, @UploadedFiles() files) {
    console.log(test);
    console.log(files.files[0]);
    console.log(files.movies[0]);
    return files;
  }

  // @HttpCode(200)
  // @Post('/uploadFile')
  // @UseInterceptors(FileInterceptor('file'))
  // async upload(@UploadedFile() file: Express.Multer.File): Promise<any> {
  //   const uploadFile = await this.firebaseService.upload(file);
  //   return uploadFile;
  // }

  // @Get('/download/:videoName')
  // async download(
  //   @Param('videoName') videoName: string,
  //   @Res() res,
  // ): Promise<any> {
  //   const deleteFile = this.firebaseService.downloadFile(videoName, res);
  //   return deleteFile;
  // }

  // @Delete('/delete')
  // async delete(@Query('fileName') fileName: string): Promise<any> {
  //   const deleteFile = this.firebaseService.deleteFile(fileName);
  //   return deleteFile;
  // }

  // @Put('/update')
  // @UseInterceptors(FileInterceptor('newFile'))
  // async updateFileInFolder(
  //   @Body('fileName')
  //   fileName: string,
  //   @UploadedFile()
  //   newFile: Express.Multer.File,
  // ): Promise<any> {
  //   const file = this.firebaseService.updateFile(fileName, newFile);
  //   return file;
  // }
}
