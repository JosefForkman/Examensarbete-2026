import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { WebsiteService } from './website.service.js';
import {
  CreateWebsiteDTO,
  UpdateWebsiteDTO,
  WebsiteDTO,
} from './dto/website.js';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Resolver(() => WebsiteDTO)
export class WebsiteResolver {
  constructor(private readonly websiteService: WebsiteService) {}

  @Query(() => [WebsiteDTO], { name: 'websites' })
  @AllowAnonymous()
  async getAll(): Promise<WebsiteDTO[]> {
    const websites = await this.websiteService.getAll();
    return websites;
  }

  @Query(() => WebsiteDTO, { name: 'website' })
  @AllowAnonymous()
  async getById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<WebsiteDTO | null> {
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
    const website = await this.websiteService.create(data);
    const createdWebsite = await this.websiteService.getById(website[0].id);

    if (!createdWebsite) {
      throw new NotFoundException('Website not found after creation');
    }

    return createdWebsite;
  }

  @Mutation(() => WebsiteDTO)
  @AllowAnonymous()
  async update(
    @Args('id', { type: () => Int }) id: number,
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
  async delete(@Args('id', { type: () => Int }) id: number) {
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
