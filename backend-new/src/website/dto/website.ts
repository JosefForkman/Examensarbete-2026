import { Field, ObjectType } from '@nestjs/graphql';
import { FilterableField } from '@ptc-org/nestjs-query-graphql';

@ObjectType('Website')
export class WebsiteDTO {
  @Field()
  id!: string;

  @FilterableField()
  siteName!: string;

  @FilterableField()
  rssUrl!: string;

  @FilterableField()
  siteUrl!: string;

  @FilterableField(() => Date, { defaultValue: new Date() })
  createdAt!: Date;

  @FilterableField(() => String, { nullable: true })
  description: string | null = null;

  @FilterableField(() => String, { nullable: true })
  imageUrl: string | null = null;
}
