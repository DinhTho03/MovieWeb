import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MESSAGES_CODE } from 'src/Constant/status.constants';
import { ImageModel } from 'src/models/Dto/image.model';
import { JsonResponse } from 'src/models/admin/list-model/json-response.model';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { Video } from 'src/database/schemas/video.schema';
import mongoose from 'mongoose';
// import { Cast } from 'src/database/schemas/cast.schema';
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class FireBaseService {
  constructor(
    @InjectModel(Video.name)
    private movieModel: mongoose.Model<Video>,
  ) {}
  async upload(file: Express.Multer.File): Promise<any> {
    const tempLocalFile = path.join(os.tmpdir(), file.originalname);

    try {
      // Validate file image
      if (!file || !file.originalname || !file.buffer) {
        throw new HttpException('Invalid file data', 200);
      }
      const dateTime = new Date();
      const unixTimestamp = Math.floor(dateTime.getTime() / 1000);
      const fileParts = file.originalname.split('.');
      const extension = '.' + fileParts[fileParts.length - 1];
      let fileName = '';
      let maxSize, fileType;
      if (file.mimetype.match(/\/(mp4|webm|ogg)$/)) {
        fileName = `webs/${unixTimestamp}` + extension;
        maxSize = 1024 * 1024 * 1024;
        fileType = 'video';
      } else if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        fileName = `files/${unixTimestamp}` + extension;
        maxSize = 5 * 1024 * 1024;
        fileType = 'image';
      } else {
        throw new HttpException(
          'File type not allowed (jpg/jpeg/png/gif)',
          200,
        );
      }
      // Validate file size
      if (file.size > maxSize) {
        throw new HttpException(
          `File size exceeds ${maxSize / (1024 * 1024)}MB`,
          500,
        );
      }
      // Write buffer to local file
      fs.writeFileSync(tempLocalFile, file.buffer);

      this.uploadToStorage(tempLocalFile, fileName, file.mimetype, fileType);
      console.log('fileName', fileName);
      // Respond immediately with JSON
      const jsonResponse = new JsonResponse<ImageModel>(true);
      jsonResponse.message = MESSAGES_CODE.UPLOAD_SUCCESS;
      jsonResponse.result = {
        name: fileName, // You might want to adjust this based on your storage structure
        url: 'pending', // You can use this to indicate that the upload is still in progress
      } as ImageModel;
      return jsonResponse;
    } catch (error) {
      // Remove local file in case of error
      if (fs.existsSync(tempLocalFile)) {
        fs.unlinkSync(tempLocalFile);
      }

      throw new HttpException(error.toString(), 500);
    }
  }

  async uploadToStorage(
    tempLocalFile: string,
    fileName: string,
    mimeType: string,
    fileType: string,
  ): Promise<void> {
    try {
      const bucket = admin.storage().bucket();
      const res = await bucket.upload(tempLocalFile, {
        destination: fileName,
        metadata: {
          cacheControl: 'public, max-age=31536000',
          contentType: mimeType,
          metadata: {
            firebaseStorageDownloadTokens: '',
          },
        },
      });
      // Remove local file
      fs.unlinkSync(tempLocalFile);
      console.log(fileName);
      const response = res[0];
      if (fileType === 'video') {
        const video = await this.movieModel
          .findOne({ movieLink: fileName })
          .exec();

        if (video) {
          video.movieLink = `https://firebasestorage.googleapis.com/v0/b/${response.metadata.bucket}/o/${response.id}?alt=media`;
          await video.save();
        }
      }
      if (fileType === 'image') {
        const video = await this.movieModel
          .findOne({ posterImage: fileName })
          .exec();

        if (video) {
          video.posterImage = `https://firebasestorage.googleapis.com/v0/b/${response.metadata.bucket}/o/${response.id}?alt=media`;
          await video.save();
        }
      }
    } catch (error) {
      // Remove local file in case of error
      if (fs.existsSync(tempLocalFile)) {
        fs.unlinkSync(tempLocalFile);
      }

      throw new HttpException(error.toString(), 200);
    }
  }

  // async uploadAvatar(file: Express.Multer.File): Promise<any> {
  //   const tempLocalFile = path.join(os.tmpdir(), file.originalname);

  //   try {
  //     // Validate file image
  //     if (!file || !file.originalname || !file.buffer) {
  //       throw new HttpException('Invalid file data', 200);
  //     }

  //     const dateTime = new Date();
  //     const unixTimestamp = Math.floor(dateTime.getTime() / 1000);
  //     const fileParts = file.originalname.split('.');
  //     const extension = '.' + fileParts[fileParts.length - 1];
  //     let fileName = '';
  //     if (file?.size > 5 * 1024 * 1024) {
  //       throw new HttpException('file size > 5MB', 200);
  //     } else if (!file?.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
  //       throw new HttpException('file not match type (jpg/jpeg/png/gif)', 200);
  //     } else {
  //       fileName = `avatar/${unixTimestamp}` + extension;
  //     }

  //     // Write buffer to local file
  //     fs.writeFileSync(tempLocalFile, file.buffer);

  //     const bucket = admin.storage().bucket();
  //     const res = await bucket.upload(tempLocalFile, {
  //       destination: fileName,
  //       metadata: {
  //         cacheControl: 'public, max-age=31536000',
  //         contentType: file.mimetype,
  //       },
  //     });

  //     // Remove local file
  //     fs.unlinkSync(tempLocalFile);

  //     const response = res[0];
  //     if (response) {
  //       const jsonResponse = new JsonResponse<ImageModel>(true);
  //       jsonResponse.result = {
  //         name: response.id,
  //         url: `https://firebasestorage.googleapis.com/v0/b/${response.metadata.bucket}/o/${response.id}?alt=media`,
  //       } as ImageModel;
  //       jsonResponse.message = MESSAGES_CODE.UPLOAD_SUCCESS;
  //       return jsonResponse;
  //     }
  //   } catch (error) {
  //     // Remove local file in case of error
  //     if (fs.existsSync(tempLocalFile)) {
  //       fs.unlinkSync(tempLocalFile);
  //     }

  //     throw new HttpException(error.toString(), 200);
  //   }

  //   throw new HttpException('Invalid file', 200);
  // }

  async downloadFile(videoName: string, res): Promise<any> {
    try {
      const bucket = admin.storage().bucket().file(`webs/${videoName}`);

      // Download the file and wait for the result
      const [fileContents] = await bucket.download();

      // Set headers for automatic download
      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Content-Disposition', `attachment; filename=${videoName}`);

      // Send the video data to the browser
      res.status(HttpStatus.OK).send(fileContents);
    } catch (error) {
      // Handle errors appropriately for your application
      console.error('Error downloading video:', error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Error downloading video');
    }
  }

  async deleteFile(fileName: string): Promise<any> {
    const jsonResponse = new JsonResponse<ImageModel>(true);
    const parts = fileName.split('/');
    const filenameWithQuery = parts[parts.length - 1];

    const filenameAfterQuery = filenameWithQuery.split('?')[0];
    const filenameSeparated = filenameAfterQuery.split('2F')[1];

    try {
      const bucket = admin.storage().bucket();
      // Extract the file extension
      const fileExtension = filenameSeparated.split('.').pop().toLowerCase();

      // Determine the folderName based on the file extension
      let folderName = '';
      if (['mp4', 'webm', 'ogg'].includes(fileExtension)) {
        folderName = 'webs';
      } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
        folderName = 'files';
        console.log('folderName', folderName);
      }
      const file = bucket.file(`${folderName}/${filenameSeparated}`);
      // Xóa tệp từ Firebase Storage
      const [exists] = await file.exists();
      if (!exists) {
        jsonResponse.success = false;
        jsonResponse.message = MESSAGES_CODE.DELETE_FAIL;
        return jsonResponse;
      }
      await file
        .createReadStream()
        .on('data', () => {})
        .on('end', async () => {
          await file.delete();
        });
      jsonResponse.message = MESSAGES_CODE.DELETED_SUCCESS;
      return jsonResponse;
    } catch (error) {
      // Handle errors appropriately for your application
      console.error('Error deleting file:', error);
      jsonResponse.success = false;
      jsonResponse.message = MESSAGES_CODE.DELETE_FAIL;
      return jsonResponse;
    }
  }

  async updateFile(
    fileName: string,
    newFile: Express.Multer.File,
  ): Promise<any> {
    console.log(newFile.originalname);
    const tempLocalFile = path.join(os.tmpdir(), newFile.originalname);
    try {
      // Validate new file
      if (!newFile || !newFile.originalname || !newFile.buffer) {
        throw new HttpException('Invalid new file data', 200);
      }

      // Optional: You can add validation for new file based on your requirements
      // Write buffer to local file
      fs.writeFileSync(tempLocalFile, newFile.buffer);
      let folderName;
      const bucket = admin.storage().bucket();
      if (newFile.mimetype.match(/\/(mp4|webm|ogg)$/)) {
        folderName = 'webs';
      }
      if (newFile.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        folderName = 'files';
      }
      const parts = fileName.split('/');
      const filenameWithQuery = parts[parts.length - 1];
      const filenameAfterQuery = filenameWithQuery.split('?')[0];
      const filenameSeparated = filenameAfterQuery.split('2F')[1];
      const file = bucket.file(`${folderName}/${filenameSeparated}`);
      const [exists] = await file.exists();
      console.log('exists', exists);
      if (exists) {
        // Update file in Firebase Storage
        const res = await file
          .createWriteStream({
            metadata: {
              cacheControl: 'public, max-age=31536000',
              contentType: newFile.mimetype,
            },
          })
          .on('error', (error) => {
            throw new HttpException(error.toString(), 500);
          })
          .on('finish', async () => {
            // Remove local file
            fs.unlinkSync(tempLocalFile);
          });
        // Pipe the file stream into the upload streamS
        fs.createReadStream(tempLocalFile).pipe(res);
        // Optional: You can return updated file details or a success message
        const jsonResponse = new JsonResponse<ImageModel>(true);
        jsonResponse.message = MESSAGES_CODE.UPDATED_SUCCESS;
        return jsonResponse;
      } else {
        throw new HttpException(MESSAGES_CODE.UPDATE_FAIL, 404);
      }
    } catch (error) {
      // Remove local file in case of error
      if (fs.existsSync(tempLocalFile)) {
        fs.unlinkSync(tempLocalFile);
      }
      throw new HttpException(error.toString(), 500);
    }
  }
}
