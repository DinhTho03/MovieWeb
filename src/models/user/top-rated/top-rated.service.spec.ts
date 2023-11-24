import { Test, TestingModule } from '@nestjs/testing';
import { TopRatedService } from './top-rated.service';

describe('TopRatedService', () => {
  let service: TopRatedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TopRatedService],
    }).compile();

    service = module.get<TopRatedService>(TopRatedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
