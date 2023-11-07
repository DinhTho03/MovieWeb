import { Test, TestingModule } from '@nestjs/testing';
import { ListModelController } from './list-movie.controller';

describe('ListModelController', () => {
  let controller: ListModelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListModelController],
    }).compile();

    controller = module.get<ListModelController>(ListModelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
