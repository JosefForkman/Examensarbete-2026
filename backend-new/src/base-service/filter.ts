import {
  and,
  eq,
  gt,
  gte,
  ilike,
  inArray,
  isNotNull,
  isNull,
  like,
  lt,
  lte,
  ne,
  SQL,
} from 'drizzle-orm';
import { PgColumn, PgTable } from 'drizzle-orm/pg-core';
import { ColumnFilter, FilterOperator, FilterPayload } from './typs/filter';

export class Filter<TTable extends PgTable> {
  constructor(private table: TTable) {}

  buildWhere(filter?: FilterPayload<TTable>): SQL | undefined {
    if (!filter || Object.keys(filter).length === 0) {
      return undefined;
    }

    const conditions: SQL[] = [];

    for (const [columnName, filterPayload] of Object.entries(filter)) {
      if (!filterPayload) {
        continue;
      }

      const column = this.table[
        columnName as keyof TTable
      ] as unknown as PgColumn;

      if (!column) {
        continue;
      }

      const filterList = Array.isArray(filterPayload)
        ? filterPayload
        : [filterPayload];

      for (const filter of filterList) {
        const condition = this.createCondition(
          column,
          filter.operator,
          filter.value,
        );

        if (condition) {
          conditions.push(condition);
        }
      }
    }

    return conditions.length > 0 ? and(...conditions) : undefined;
  }

  private createCondition(
    column: PgColumn,
    operator: FilterOperator,
    value: unknown,
  ) {
    switch (operator) {
      case 'eq':
        return eq(column, value);
      case 'ne':
        return ne(column, value);
      case 'gt':
        return gt(column, value);
      case 'gte':
        return gte(column, value);
      case 'lt':
        return lt(column, value);
      case 'lte':
        return lte(column, value);
      case 'like':
        return typeof value === 'string'
          ? like(column, `%${value}%`)
          : undefined;
      case 'ilike':
        return typeof value === 'string'
          ? ilike(column, `%${value}%`)
          : undefined;
      case 'in':
        return Array.isArray(value) && value.length > 0
          ? inArray(column, value)
          : undefined;
      case 'isNull':
        return value === undefined ? isNull(column) : isNotNull(column);
      default:
        return undefined;
    }
  }
}

import { websites } from '../db/own.schema';
import { ArgsType, Field } from '@nestjs/graphql';
import { ColumnFilterInput } from 'src/website/dto/website.filter.input';

@ArgsType()
export class f {
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
