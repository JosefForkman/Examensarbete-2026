import { GraphQLISODateTime, InputType } from '@nestjs/graphql';
import { FilterableField } from '@ptc-org/nestjs-query-graphql';

@InputType('CreatePostItem')
export class PostItemCreateDto {
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
