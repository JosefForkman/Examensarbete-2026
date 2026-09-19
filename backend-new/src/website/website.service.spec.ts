import { Test, TestingModule } from '@nestjs/testing';
import { WebsiteService } from './website.service';
import { DRIZZLE } from '../db/db.module';

describe('WebsiteService', () => {
  let service: WebsiteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebsiteService,
        {
          provide: DRIZZLE,
          useValue: {
            // Mock the methods you need for testing
            select: jest.fn().mockReturnThis(),
            from: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    service = module.get<WebsiteService>(WebsiteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
