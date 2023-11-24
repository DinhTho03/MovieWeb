import {
  HttpCode,
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRes } from './dto/registerRes.dto';
import { TestAPI } from './dto/test';
import { LoginRes } from './dto/loginRes.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorator/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @UseGuards(AuthGuard('local'))
  async Login(@Body() loginRes: LoginRes) {
    console.log(loginRes);
    const login = await this.authService.loginUser(loginRes);
    return login;
  }

  @Post('/register')
  async Register(@Body() user: RegisterRes) {
    const register = await this.authService.registerUser(user);
    return register;
  }

  @UseGuards(RolesGuard)
  @Roles('Admin')
  @HttpCode(200)
  @Get('/test')
  async test(@Request() req) {
    console.log(req);

    return req.user;
  }
}
