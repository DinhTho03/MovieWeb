import { Test, TestingModule } from '@nestjs/testing';
import { DetailMovieService } from './detail-movie.service';

describe('DetailMovieService', () => {
  let service: DetailMovieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetailMovieService],
    }).compile();

    service = module.get<DetailMovieService>(DetailMovieService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
