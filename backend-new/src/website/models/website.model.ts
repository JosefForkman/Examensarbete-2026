import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Followed } from 'src/followed/models/followed.model';
import { PostItem } from 'src/post-item/models/Post-item.model';

@ObjectType()
export class Website {
  @Field(() => Int)
  id!: number;

  @Field()
  SiteName!: string;

  @Field(() => String, { nullable: true })
  Description!: string;

  @Field()
  RSSUrl!: string;

  @Field()
  SiteUrl!: string;

  @Field(() => String, { nullable: true })
  ImageUrl!: string;

  @Field(() => Date, { defaultValue: new Date() })
  CreatedAt!: Date;

  @Field(() => Date, { defaultValue: new Date() })
  UpdatedAt!: Date;

  @Field(() => [PostItem], { nullable: true })
  PostItems!: PostItem[];

  @Field(() => [Followed], { nullable: true })
  FollowedByUser!: Followed[];
}
