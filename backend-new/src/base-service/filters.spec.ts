import { drizzle } from 'drizzle-orm/node-postgres';
import { Filter } from './filter';
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

describe('Filter', () => {
  const mockTable = pgTable('mock_table', () => ({
    id: text('id').primaryKey(),
    value: integer('value'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  }));

  const db = drizzle.mock();

  it('builds a filter for equality', async () => {
    const filter = new Filter(mockTable);

    const whereClause = filter.buildWhere({
      id: { operator: 'eq', value: 'one' },
    });
    const result = db.select().from(mockTable).where(whereClause).toSQL();

    expect(result.sql).toBe(
      'select "id", "value", "created_at", "updated_at" from "mock_table" where "mock_table"."id" = $1',
    );
  });

  it('builds a filter for multiple conditions', () => {
    const filter = new Filter(mockTable);
    const whereClause = filter.buildWhere({
      id: { operator: 'eq', value: 'one' },
      value: { operator: 'gt', value: 10 },
    });
    const result = db.select().from(mockTable).where(whereClause).toSQL();
    expect(result.sql).toBe(
      'select "id", "value", "created_at", "updated_at" from "mock_table" where (("mock_table"."id" = $1) and ("mock_table"."value" > $2))',
    );
  });

  it('returns undefined for empty filter', () => {
    const filter = new Filter(mockTable);
    const whereClause = filter.buildWhere({});
    expect(whereClause).toBeUndefined();
  });

  it('returns undefined for undefined filter', () => {
    const filter = new Filter(mockTable);
    const whereClause = filter.buildWhere(undefined);
    expect(whereClause).toBeUndefined();
  });
});
