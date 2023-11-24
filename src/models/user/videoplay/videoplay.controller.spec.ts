import { Test, TestingModule } from '@nestjs/testing';
import { VideoplayController } from './videoplay.controller';

describe('VideoplayController', () => {
  let controller: VideoplayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideoplayController],
    }).compile();

    controller = module.get<VideoplayController>(VideoplayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
