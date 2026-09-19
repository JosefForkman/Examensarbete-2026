import { Test, TestingModule } from '@nestjs/testing';
import { BaseServiceService } from './base-service.service';
import { DRIZZLE } from '../db/db.module';

describe('BaseServiceService', () => {
  let service: BaseServiceService<'websites'>;

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
          provide: BaseServiceService,
          useFactory: (db) => new BaseServiceService(db, 'websites'),
          inject: [DRIZZLE],
        },
        {
          provide: DRIZZLE,
          useValue: mockDb,
        },
      ],
    }).compile();

    service = module.get<BaseServiceService<'websites'>>(
      BaseServiceService<'websites'>,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
