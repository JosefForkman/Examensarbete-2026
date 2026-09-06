import { Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from 'src/db/db.module';
import { relations, schema } from '../db/schema.js';
import { PgSelect, PgTableWithColumns } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';
import {
  inferInsertType,
  inferSelectType,
  inferUpdateType,
  pgTableDefinition,
  SchemaTables,
} from './typs/DB.types.js';
import { PaginationArgs } from 'src/args/pagination.args';

export class BaseServiceService<T extends SchemaTables> {
  constructor(
    @Inject(DRIZZLE) protected db: NodePgDatabase<typeof relations>,
    public tableName: T,

    private tableDefinition = schema[
      tableName
    ] as PgTableWithColumns<pgTableDefinition>,
  ) {}

  /***
   * Adds pagination to a query.
   * @param query The query to paginate.
   * @param paginationArgs The pagination arguments.
   * @returns The paginated query.
   */
  private withPagination<T extends PgSelect>(
    query: T,
    paginationArgs: PaginationArgs,
  ): T {
    const { first, after } = paginationArgs;

    // Decode the 'after' cursor from base64 to an integer offset
    const decodedAfter = parseInt(
      Buffer.from(after ?? '', 'base64').toString('utf-8'),
      10,
    );

    return query.limit(first ?? 10).offset(after ? decodedAfter : 0);
  }

  async getAll(PaginationArgs: PaginationArgs): Promise<inferSelectType<T>[]> {
    const query = this.db.select().from(this.tableDefinition);
    const paginatedQuery = await this.withPagination(
      query.$dynamic(),
      PaginationArgs,
    );
    return paginatedQuery;
  }

  // async getAll(): Promise<inferSelectType<T>[]> {
  //   return await this.db.select().from(this.tableDefinition);
  // }

  async getById(id: string): Promise<inferSelectType<T> | null> {
    const results = await this.db
      .select()
      .from(this.tableDefinition)
      .where(eq(this.tableDefinition.id, id))
      .limit(1);

    const result = results.at(0);

    if (result === undefined) {
      return null;
    }

    return result;
  }

  async create(data: inferInsertType<T>) {
    const createdRecord = await this.db
      .insert(this.tableDefinition)
      .values(data)
      .returning();

    return createdRecord;
  }

  async update(
    id: string,
    data: Partial<inferUpdateType<T>>,
  ): Promise<inferSelectType<T> | null> {
    const [updatedRecord] = await this.db
      .update(this.tableDefinition)
      .set(data)
      .where(eq(this.tableDefinition.id, id))
      .returning();

    return updatedRecord;
  }

  async delete(id: string) {
    const deletedRecord = await this.db
      .delete(this.tableDefinition)
      .where(eq(this.tableDefinition.id, id))
      .returning();

    return deletedRecord;
  }
}
