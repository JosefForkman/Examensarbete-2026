import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '../db/db.module';
import { relations, schema } from '../db/schema';
import { PgTableWithColumns } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';
import {
  inferInsertType,
  inferSelectType,
  inferUpdateType,
  pgTableDefinition,
  SchemaTables,
} from './typs/DB.types.js';
import { Filter } from './filter';
import { FilterPayload } from './typs/filter';

@Injectable()
export class BaseServiceService<T extends SchemaTables> {
  private filter: Filter<typeof this.tableDefinition>;
  constructor(
    @Inject(DRIZZLE) protected db: NodePgDatabase<typeof relations>,
    public tableName: T,

    private tableDefinition = schema[
      tableName
    ] as PgTableWithColumns<pgTableDefinition>,
  ) {
    this.filter = new Filter(this.tableDefinition);
  }

  async getAll(
    filter?: FilterPayload<typeof this.tableDefinition>,
  ): Promise<inferSelectType<T>[]> {
    const where = this.filter.buildWhere(filter);

    return this.db.select().from(this.tableDefinition).where(where);
  }

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
