import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Watched {
  @Field(() => Int)
  id!: number;

  @Field()
  SiteName!: string;

  @Field()
  SiteUrl!: string;

  @Field()
  RssUrl!: string;
}
