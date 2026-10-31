import { GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { FilterableField } from '@ptc-org/nestjs-query-graphql';

@ObjectType('PostItem')
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
}
