import { IsString } from 'class-validator';

export class TestAPI {
  @IsString()
  email: string;
  @IsString()
  password: string;
}
