import { ArgsType, Field, InputType, registerEnumType } from '@nestjs/graphql';
import { ColumnFilter } from 'src/base-service/typs/filter';
import { websites } from 'src/db/own.schema';

export enum FilterOperator {
  EQ = 'eq',
  NE = 'ne',
  GT = 'gt',
  GTE = 'gte',
  LT = 'lt',
  LTE = 'lte',
  LIKE = 'like',
  ILIKE = 'ilike',
  IN = 'in',
  IS_NULL = 'isNull',
}

registerEnumType(FilterOperator, {
  name: 'FilterOperator',
  description: 'Tillgängliga filtreringsoperatorer',
});

@InputType()
export class ColumnFilterInput {
  @Field(() => FilterOperator)
  operator: FilterOperator;

  @Field({ nullable: true })
  value?: string;
}

@ArgsType()
export class UserFilterInput {
  @Field(() => [ColumnFilterInput], { nullable: true })
  createdAt: ColumnFilter<typeof websites>[];

  @Field(() => [ColumnFilterInput], { nullable: true })
  updatedAt: ColumnFilter<typeof websites>[];

  @Field(() => [ColumnFilterInput], { nullable: true })
  id: ColumnFilter<typeof websites>[];

  @Field(() => [ColumnFilterInput], { nullable: true })
  name: ColumnFilter<typeof websites>[];

  @Field(() => [ColumnFilterInput], { nullable: true })
  url: ColumnFilter<typeof websites>[];

  @Field(() => [ColumnFilterInput], { nullable: true })
  description: ColumnFilter<typeof websites>[];

  @Field(() => [ColumnFilterInput], { nullable: true })
  imageUrl: ColumnFilter<typeof websites>[];

  @Field(() => [ColumnFilterInput], { nullable: true })
  userId: ColumnFilter<typeof websites>[];

  @Field(() => [ColumnFilterInput], { nullable: true })
  rssUrl: ColumnFilter<typeof websites>[];

  @Field(() => [ColumnFilterInput], { nullable: true })
  siteName: ColumnFilter<typeof websites>[];

  @Field(() => [ColumnFilterInput], { nullable: true })
  siteUrl: ColumnFilter<typeof websites>[];
}
