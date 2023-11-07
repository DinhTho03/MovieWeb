import { Test, TestingModule } from '@nestjs/testing';
import { DetailMovieController } from './detail-movie.controller';

describe('DetailMovieController', () => {
  let controller: DetailMovieController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetailMovieController],
    }).compile();

    controller = module.get<DetailMovieController>(DetailMovieController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
