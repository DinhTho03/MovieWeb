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
import { TestAPI } from './dto/genre.Dto';

@Controller('list-model')
export class ListModelController {
  private readonly logger = new Logger(ListModelController.name);
  constructor(
    private listModelService: ListModelService,
    private firebaseService: FireBaseService,
  ) {}

  // Get all movie
  @Get()
  async findAll(
    @Query('searchQuery') searchQuery: string,
    @Query('pageNumber') pageNumber: number = 1,
  ) {
    return await this.listModelService.FindAll(searchQuery, pageNumber);
  }

  // Delete a movie
  @Delete()
  async deleteAMovie(@Query('id') id: string) {
    // Convert string to ObjectId
    const objectId = new (ObjectId as any)(id);
    const deleteMovie = await this.listModelService.deleteAMovie(objectId);
    return deleteMovie;
  }

  // Delete list movie
  @Delete('/deleteListMovie')
  async deleteListMovie(@Body('ids') ids: string[]) {
    // Convert string to ObjectId
    const objectIdList = ids.map((id) => new (ObjectId as any)(id));
    const deleteListMovie =
      await this.listModelService.deleteListMovie(objectIdList);
    return deleteListMovie;
  }

  // Add movie
  @Post('/addMovie')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'posterImage', maxCount: 1 },
      { name: 'movieUrl', maxCount: 1 },
      { name: 'avatar', maxCount: 10 },
    ]),
  )
  @HttpCode(200)
  async addMovie(@Body() modelRequest: MovieRes, @UploadedFiles() files) {
    const addMovie = await this.listModelService.addMovie(modelRequest, files);

    return addMovie;
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
      { name: 'posterImage', maxCount: 1 },
      { name: 'movieUrl', maxCount: 1 },
      { name: 'avatar', maxCount: 10 },
    ]),
  )
  async addCast(@Body() model: TestAPI, @UploadedFiles() files) {
    console.log(model);
    const addCast2 = files.avatar[0];
    console.log(addCast2);
    return null;
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
