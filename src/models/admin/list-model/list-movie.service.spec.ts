import { Test, TestingModule } from '@nestjs/testing';
import { ListModelService } from './list-movie.service';

describe('ListModelService', () => {
  let service: ListModelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListModelService],
    }).compile();

    service = module.get<ListModelService>(ListModelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
