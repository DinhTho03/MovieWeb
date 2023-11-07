/* eslint-disable @typescript-eslint/no-var-requires */
import {
  Delete,
  Get,
  Controller,
  Query,
  Body,
  HttpCode,
  UploadedFile,
  Post,
  HttpException,
  UseInterceptors,
} from '@nestjs/common';
import { ListModelService } from './list-movie.service';
import { ObjectId } from 'mongodb';
import * as path from 'path';
import * as admin from 'firebase-admin';
import * as fs from 'fs/promises';
import { ImageModel } from './image.model';
import { MESSAGES_CODE } from './dto/messages.constants';
import { JsonResponse } from './json-response.model';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('list-model')
export class ListModelController {
  constructor(private listModelService: ListModelService) {}

  @Get()
  async findAll(
    @Query('searchQuery') searchQuery: string,
    @Query('pageNumber') pageNumber: number = 1,
  ) {
    return await this.listModelService.FindAll(searchQuery, pageNumber);
  }

  @Delete()
  async deleteAMovie(@Query('id') id: string) {
    const objectId = new (ObjectId as any)(id);
    return await this.listModelService.deleteAMovie(objectId);
  }

  @Delete('/deleteListMovie')
  async deleteListMovie(@Body('ids') ids: string[]) {
    const objectIdList = ids.map((id) => new (ObjectId as any)(id));
    console.log(objectIdList);
    return await this.listModelService.deleteListMovie(objectIdList);
  }

  @HttpCode(200)
  @Post('/image')
  @UseInterceptors(FileInterceptor('file'))
  async Upload(@UploadedFile() file: Express.Multer.File): Promise<any> {
    if (!file) {
      throw new HttpException('No file uploaded', 200);
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new HttpException('File size > 5MB', 200);
    }

    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      throw new HttpException('File not match type (Jpg/jpeg/png/gif)', 200);
    }

    try {
      const remotePath = `files/${file.originalname}`;
      const bucket = admin.storage().bucket();
      let res = await bucket.upload(file.path, {
        destination: remotePath,
        metadata: {
          cacheControl: 'public, max-age=31536000',
          contentType: file.mimetype,
        },
      });
      console.log(typeof res);

      // Xóa tệp tạm sau khi đã tải lên Firebase Storage
      const uploadedFile = res[0];
      console.log(uploadedFile);
      if (uploadedFile) {
        // Xóa tệp tạm trên máy chủ cục bộ
        const localFilePath = `./files/${path.basename(file.path)}`;
        fs.unlink(localFilePath);

        const jsonResponse = new JsonResponse<ImageModel>(
          true,
          MESSAGES_CODE.UPLOAD_SUCCESS,
          {
            name: file.originalname,
            url: uploadedFile.publicUrl(),
          } as ImageModel,
        );
        jsonResponse.message = MESSAGES_CODE.UPLOAD_SUCCESS;
        return jsonResponse;
      } else {
        throw new HttpException('File upload failed', 200);
      }
    } catch (e) {
      throw new HttpException(e.toString(), 500);
    }
  }
}
