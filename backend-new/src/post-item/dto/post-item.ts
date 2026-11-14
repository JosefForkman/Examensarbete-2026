import { GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import {
  FilterableField,
  UnPagedRelation,
} from '@ptc-org/nestjs-query-graphql';
import { WebsiteDTO } from 'src/website/dto/website';

@ObjectType('PostItem')
@UnPagedRelation('websites', () => WebsiteDTO, { nullable: true })
export class PostItemDto {
  @FilterableField()
  id: string;

  @FilterableField()
  title: string;

  @FilterableField({ nullable: true })
  description?: string;

  @FilterableField()
  link: string;

  @FilterableField({ nullable: true })
  imageUrl?: string;

  @FilterableField(() => GraphQLISODateTime)
  publicationDate: Date;

  // @FilterableField()
  // website?: WebsiteDTO;
}
