import { ID, ObjectType } from '@nestjs/graphql';
import {
  FilterableField,
  FilterableRelation,
} from '@ptc-org/nestjs-query-graphql';
import { WebsiteDTO } from 'src/website/dto/website';

@ObjectType('Followed')
@FilterableRelation('website', () => WebsiteDTO, { nullable: true })
export class FollowedDto {
  @FilterableField(() => ID)
  id: number;

  // @FilterableField(() => WebsiteDTO, { nullable: true })
  // website: WebsiteDTO;
}
