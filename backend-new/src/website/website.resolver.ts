import { Resolver } from '@nestjs/graphql';
import { WebsiteService } from './website.service.js';
import { Query } from '@nestjs/graphql';
import { WebsiteDTO } from './dto/website.js';

@Resolver(() => WebsiteDTO)
export class WebsiteResolver {
  constructor(private readonly websiteService: WebsiteService) {}

  @Query(() => [WebsiteDTO])
  async getAllWebsites(): Promise<WebsiteDTO[]> {
    return this.websiteService.getAll();
  }
}
