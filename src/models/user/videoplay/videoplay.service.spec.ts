import { Test, TestingModule } from '@nestjs/testing';
import { VideoplayService } from './videoplay.service';

describe('VideoplayService', () => {
  let service: VideoplayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VideoplayService],
    }).compile();

    service = module.get<VideoplayService>(VideoplayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
