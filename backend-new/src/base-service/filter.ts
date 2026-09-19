import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { PgColumn, PgSelect, PgTableWithColumns } from 'drizzle-orm/pg-core';
import { relations, schema } from 'src/db/schema';
import { pgTableDefinition, SchemaTables } from './typs/DB.types';
import { Inject } from '@nestjs/common';
import { DRIZZLE } from 'src/db/db.module';
import { eq, getColumns, gt, gte, lt, lte, ne, SQL } from 'drizzle-orm';

type MathOperator = '>' | '<' | '=' | '>=' | '<=' | '!=';
type MathCondition<TColumn extends PgColumn = PgColumn> = {
  column: TColumn;
  operator: MathOperator;
  value: TColumn['_']['data'];
};

export class Filter<T extends SchemaTables> {
  constructor(
    @Inject(DRIZZLE) protected db: NodePgDatabase<typeof relations>,
    public tableName: T,
    private tableDefinition = schema[
      tableName
    ] as PgTableWithColumns<pgTableDefinition>,
  ) {}

  public filterByColumn<K extends string, TColumn extends PgColumn = PgColumn>(
    columnName: K,
    operator: MathOperator,
    value: TColumn['_']['data'],
  ) {
    const query = this.db.select().from(this.tableDefinition).$dynamic();

    const columns = getColumns(this.tableDefinition);
    type columnName = keyof typeof columns;

    const targetColumn = columns[columnName as columnName];

    if (!targetColumn) {
      throw new Error(
        `Kolumnen ${columnName} finns inte på tabellen ${String(this.tableName)}`,
      );
    }

    const filteredQuery = this.withFilters(query, {
      column: targetColumn,
      operator,
      value,
    });

    return filteredQuery;
  }

  private withFilters<TSelect extends PgSelect>(
    qb: TSelect,
    condition: MathCondition,
  ) {
    const { column, operator, value } = condition;
    let clause: SQL;

    switch (operator) {
      case '>':
        clause = gt(column, value);
        break;
      case '<':
        clause = lt(column, value);
        break;
      case '=':
        clause = eq(column, value);
        break;
      case '>=':
        clause = gte(column, value);
        break;
      case '<=':
        clause = lte(column, value);
        break;
      case '!=':
        clause = ne(column, value);
        break;
    }

    return qb.where(clause);
  }
}
