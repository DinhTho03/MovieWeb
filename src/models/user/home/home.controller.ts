import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { HomeService } from './home.service';
import { Roles } from 'src/models/auth/decorator/roles.decorator';
import { RolesGuard } from 'src/models/auth/guards/roles.guard';

@Controller('home')
export class HomeController {
  constructor(private homeService: HomeService) {}
  @Get()
  @UseGuards(RolesGuard)
  @Roles('Admin', 'User')
  async getHome(@Request() req) {
    const userId = req.user.id;
    return await this.homeService.GetMovie(userId);
  }
}
