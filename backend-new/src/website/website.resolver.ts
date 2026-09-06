import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { WebsiteService } from './website.service.js';
import {
  CreateWebsiteDTO,
  UpdateWebsiteDTO,
  WebsiteDTO,
  WebsitePaginatedDTO,
} from './dto/website.js';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { PaginationArgs } from 'src/args/pagination.args';
import { Pagination } from 'src/base-service/pagination';

@Resolver(() => WebsitePaginatedDTO)
export class WebsiteResolver {
  constructor(private readonly websiteService: WebsiteService) {}

  @Query(() => WebsitePaginatedDTO, { name: 'websites' })
  @AllowAnonymous()
  async getAll(
    @Args()
    pagination: PaginationArgs,
  ): Promise<WebsitePaginatedDTO> {
    const websites = await this.websiteService.getAll();
    return new Pagination(websites, pagination).getResult();
  }

  @Query(() => WebsitePaginatedDTO, { name: 'website' })
  @AllowAnonymous()
  async getById(@Args('id') id: string): Promise<WebsiteDTO | null> {
    const website = await this.websiteService.getById(id);

    if (!website) {
      throw new NotFoundException('Website not found');
    }

    return website;
  }

  @Mutation(() => WebsiteDTO)
  @AllowAnonymous()
  async create(
    @Args('data', { type: () => CreateWebsiteDTO }) data: CreateWebsiteDTO,
  ): Promise<WebsiteDTO> {
    const [website] = await this.websiteService.create(data);
    const createdWebsite = await this.websiteService.getById(website.id);

    if (!createdWebsite) {
      throw new NotFoundException('Website not found after creation');
    }

    return createdWebsite;
  }

  @Mutation(() => WebsiteDTO)
  @AllowAnonymous()
  async update(
    @Args('id') id: string,
    @Args('data', { type: () => UpdateWebsiteDTO }) data: UpdateWebsiteDTO,
  ): Promise<WebsiteDTO> {
    const updatedWebsite = await this.websiteService.update(id, data);

    if (!updatedWebsite) {
      throw new NotFoundException('Website not found for update');
    }

    return updatedWebsite;
  }

  @Mutation(() => Boolean)
  @AllowAnonymous()
  async delete(@Args('id') id: string) {
    const deletedWebsite = await this.websiteService.delete(id);

    if (!deletedWebsite) {
      throw new NotFoundException('Website not found for deletion');
    }

    throw new HttpException(
      {
        status: HttpStatus.NO_CONTENT,
        message: 'Website deleted successfully',
      },
      HttpStatus.NO_CONTENT,
    );
  }
}
