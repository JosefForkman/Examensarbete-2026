import { Test, TestingModule } from '@nestjs/testing';
import { WebsiteResolver } from './website.resolver';

describe('WebsiteResolver', () => {
  let resolver: WebsiteResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebsiteResolver],
    }).compile();

    resolver = module.get<WebsiteResolver>(WebsiteResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
