import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PostItem {
  @Field(() => Int)
  id!: number;

  @Field()
  Title!: string;

  @Field(() => String, { nullable: true })
  Description?: string;

  @Field()
  Link!: string;

  @Field()
  ImageUrl!: string;

  @Field(() => Date, { defaultValue: new Date() })
  PublicationDate!: Date;

  @Field(() => [Watched], { nullable: true })
  WatchedByUser!: Watched[];
}
