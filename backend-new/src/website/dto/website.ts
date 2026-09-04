import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('Website')
export class WebsiteDTO {
  @Field(() => Int)
  id!: number;
  @Field()
  siteName!: string;
  @Field()
  rssUrl!: string;
  @Field()
  siteUrl!: string;
  @Field(() => Date, { defaultValue: new Date() })
  createdAt!: Date;
  @Field(() => String, { nullable: true })
  description: string | null = null;
  @Field(() => String, { nullable: true })
  imageUrl: string | null = null;
}

@InputType('CreateWebsiteInput')
export class CreateWebsiteDTO {
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

@InputType('UpdateWebsiteInput')
export class UpdateWebsiteDTO {
  @Field(() => String, { nullable: true })
  siteName?: string;
  @Field(() => String, { nullable: true })
  rssUrl?: string;
  @Field(() => String, { nullable: true })
  siteUrl?: string;
  @Field(() => String, { nullable: true })
  description?: string;
  @Field(() => String, { nullable: true })
  imageUrl?: string;
}
