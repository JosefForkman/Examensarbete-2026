import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Watched {
  @Field(() => Int)
  id!: number;

  
}
