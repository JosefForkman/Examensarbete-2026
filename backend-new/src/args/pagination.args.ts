import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, {
    nullable: true,
    description: 'Number of items to return',
  })
  first?: number;

  @Field(() => String, { nullable: true, description: 'Cursor for pagination' })
  after?: string;
}
