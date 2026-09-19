import { Test, TestingModule } from '@nestjs/testing';
import { WebsiteResolver } from './website.resolver';
import { DRIZZLE } from '../db/db.module';
import { WebsiteService } from './website.service';

describe('WebsiteResolver', () => {
  let resolver: WebsiteResolver;

  const mockDb = {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    returning: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: WebsiteResolver,
          useFactory: (db) => new WebsiteResolver(db),
          inject: [DRIZZLE],
        },
        {
          provide: DRIZZLE,
          useValue: mockDb,
        },
      ],
    }).compile();

    resolver = module.get<WebsiteResolver>(WebsiteResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
