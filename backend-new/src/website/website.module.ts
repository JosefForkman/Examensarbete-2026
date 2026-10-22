import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Website } from 'src/entities/website.entities';
import { WebsiteDTO } from './dto/website';
import { WebsiteCreateDto } from './dto/website.create.dto';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([Website])],
      resolvers: [
        {
          DTOClass: WebsiteDTO,
          EntityClass: Website,
          CreateDTOClass: WebsiteCreateDto,

          read: { decorators: [AllowAnonymous()] },
        },
      ],
    }),
  ],
})
export class WebsiteModule {}
