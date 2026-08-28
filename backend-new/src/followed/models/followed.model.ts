import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/models/user.model.js';
import { Website } from 'src/website/models/website.model.js';

@ObjectType()
export class Followed {
  @Field(() => Int)
  id!: number;

  @Field(() => User, { name: 'user', nullable: true })
  user?: User;

  userId!: string;

  @Field(() => Website, {
    name: 'website',
  })
  Website?: Website;

  websiteId!: number;
}
