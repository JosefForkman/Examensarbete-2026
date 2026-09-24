import { ArgsType, Field } from '@nestjs/graphql';
import { UserFilterInput } from 'src/website/dto/website.filter.input';

@ArgsType()
export class WebsiteFilterArgs {
  @Field(() => UserFilterInput, { nullable: true })
  filter?: UserFilterInput;
}
