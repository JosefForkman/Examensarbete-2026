import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NotFoundException } from '@nestjs/common';
import { WebsiteService } from './website.service.js';
import {
  CreateWebsiteDTO,
  UpdateWebsiteDTO,
  WebsiteDTO,
} from './dto/website.js';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import type { inferSelectType } from 'src/base-service/typs/DB.types.js';

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
    @Args('id', { type: () => String }) id: string,
  ): Promise<WebsiteDTO | null> {
    const website = await this.websiteService.getById(id);
    return website;
  }

  @Mutation(() => WebsiteDTO)
  @AllowAnonymous()
  async create(
    @Args('data', { type: () => CreateWebsiteDTO }) data: CreateWebsiteDTO,
  ): Promise<inferSelectType<'websites'>> {
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
    @Args('id', { type: () => String }) id: string,
    @Args('data', { type: () => UpdateWebsiteDTO }) data: UpdateWebsiteDTO,
  ): Promise<inferSelectType<'websites'>> {
    const updatedWebsite = await this.websiteService.update(id, data);

    if (!updatedWebsite) {
      throw new NotFoundException('Website not found for update');
    }

    return updatedWebsite;
  }

  @Mutation(() => Boolean)
  @AllowAnonymous()
  async delete(
    @Args('id', { type: () => String }) id: string,
  ): Promise<boolean> {
    await this.websiteService.delete(id);
    return true;
  }
}
