import { FilterableField, Relation } from '@ptc-org/nestjs-query-graphql';
import { PostItemDto } from 'src/post-item/dto/post-item';

// @Relation('followers', () => FollowedDto, { nullable: true })
@Relation('postItems', () => PostItemDto, { nullable: true })
export class WatchedDto {
  @FilterableField()
  id: string;

  @FilterableField()
  siteName: string;

  @FilterableField()
  rssUrl: string;

  @FilterableField()
  siteUrl: string;

  @FilterableField({ name: 'createdAt' })
  createdAt: Date;

  @FilterableField({ nullable: true })
  description: string;

  @FilterableField({ nullable: true })
  imageUrl: string;

  @FilterableField()
  followersId: string;

  @FilterableField({ nullable: true })
  postItems: PostItemDto[];
}
