import { Resolver } from '@nestjs/graphql';
import { WebsiteService } from './website.service.js';
import { Query } from '@nestjs/graphql';
import { WebsiteDTO } from './dto/website.js';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Resolver(() => WebsiteDTO)
export class WebsiteResolver {
  constructor(private readonly websiteService: WebsiteService) {}

  @Query(() => [WebsiteDTO], { name: 'websites' })
  @AllowAnonymous()
  async getAll(): Promise<WebsiteDTO[]> {
    return this.websiteService.getAll();
  }
}
