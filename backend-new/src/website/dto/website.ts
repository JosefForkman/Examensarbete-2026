import { Field, ObjectType } from '@nestjs/graphql';
import {
  FilterableField,
  UnPagedRelation,
} from '@ptc-org/nestjs-query-graphql';
import { FollowedDto } from 'src/followed/dto/followed.dto';
import { PostItemDto } from 'src/post-item/dto/post-item';

@ObjectType('Website')
@UnPagedRelation('postItems', () => PostItemDto, { nullable: true })
@UnPagedRelation('followers', () => FollowedDto, { nullable: true })
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
