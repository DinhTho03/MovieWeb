import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
} from 'class-validator';

export class UploadFilesDto {
  @IsNotEmpty()
  posterImage: any;

  @IsNotEmpty()
  movieUrl: any;

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one avatar is required' })
  @ArrayMaxSize(10, { message: 'Maximum 10 avatars are allowed' })
  avatar: any[];
}
