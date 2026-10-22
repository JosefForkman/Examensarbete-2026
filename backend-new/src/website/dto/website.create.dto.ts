import { Field, InputType } from '@nestjs/graphql';

@InputType('CreateWebsite')
export class WebsiteCreateDto {
  @Field()
  siteName!: string;
  @Field()
  rssUrl!: string;
  @Field()
  siteUrl!: string;
  @Field(() => String, { nullable: true })
  description?: string;
  @Field(() => String, { nullable: true })
  imageUrl?: string;
}
