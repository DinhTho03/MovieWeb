import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { VideoplayService } from './videoplay.service';
import { Roles } from 'src/models/auth/decorator/roles.decorator';
import { RolesGuard } from 'src/models/auth/guards/roles.guard';

@Controller('videoplay')
export class VideoplayController {
  constructor(private videoplayService: VideoplayService) {}
  @Get()
  @UseGuards(RolesGuard)
  @Roles('User', 'Admin')
  async findVideoPlay(@Query('id') id: string, @Request() req) {
    const userId = req.user.id;
    return await this.videoplayService.getVideoPlay(id, userId);
  }
}
