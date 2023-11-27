import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { TopRatedService } from './top-rated.service';
import { RolesGuard } from 'src/models/auth/guards/roles.guard';
import { Roles } from 'src/models/auth/decorator/roles.decorator';

@Controller('top-rated')
export class TopRatedController {
  constructor(private topRatedService: TopRatedService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles('Admin', 'User')
  async getTopRated(
    @Query('searchQuery') searchQuery: string | undefined,
  ): Promise<any> {
    return await this.topRatedService.getTopRated(searchQuery);
  }
}
