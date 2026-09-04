import { PgTableWithColumns } from 'drizzle-orm/pg-core';
import { schema } from 'src/db/schema';

export type pgTableStructure = {
  [K in keyof typeof schema]: (typeof schema)[K] extends PgTableWithColumns<
    infer TColumns
  >
    ? { tableName: K; columns: TColumns }
    : never;
}[keyof typeof schema];

export type pgTableDefinition = pgTableStructure['columns'];

export type SchemaTables = pgTableStructure['tableName'];

export type inferSelectType<T extends SchemaTables> =
  (typeof schema)[T]['$inferSelect'];

export type inferInsertType<T extends SchemaTables> =
  (typeof schema)[T]['$inferInsert'];

export type inferUpdateType<T extends SchemaTables> = Omit<
  (typeof schema)[T]['$inferInsert'],
  'id'
>;
