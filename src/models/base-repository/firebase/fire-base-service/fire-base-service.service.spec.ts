import { Test, TestingModule } from '@nestjs/testing';
import { FireBaseService } from './fire-base-service.service';

describe('FireBaseServiceService', () => {
  let service: FireBaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FireBaseService],
    }).compile();

    service = module.get<FireBaseService>(FireBaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
