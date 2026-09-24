import { PgTable } from 'drizzle-orm/pg-core';

export type FilterOperator =
  | 'eq'
  | 'ne'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'like'
  | 'ilike'
  | 'in'
  | 'isNull';

export interface ColumnFilter<TVal = unknown> {
  operator: FilterOperator;
  value: TVal;
}

type TableFilter<TTableMap> = {
  [K in keyof TTableMap]?: ColumnFilter | ColumnFilter[];
};

export type FilterPayload<TTable extends PgTable> = TableFilter<
  TTable['_']['columns']
>;
