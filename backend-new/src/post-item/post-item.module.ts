import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { PostItems } from 'src/entities/PostItems.entities';
import { PostItemDto } from './dto/post-item';
import { PostItemCreateDto } from './dto/post-item-create.dto';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([PostItems])],
      resolvers: [
        {
          DTOClass: PostItemDto,
          EntityClass: PostItems,
          CreateDTOClass: PostItemCreateDto,

          read: { decorators: [AllowAnonymous()] },
        },
      ],
    }),
  ],
})
export class PostItemModule {}
