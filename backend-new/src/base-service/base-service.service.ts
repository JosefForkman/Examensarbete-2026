import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { PgTable, PgTableWithColumns } from 'drizzle-orm/pg-core';
import { DRIZZLE } from 'src/db/db.module';
import { relations, schema } from '../db/schema.js';

@Injectable()
export class BaseServiceService<
TTable extends PgTableWithColumns<any>,
  K extends keyof typeof schema,
  TSelect = TTable['$inferSelect'],
  TInsert = TTable['$inferInsert'],
> {
  constructor(
    @Inject(DRIZZLE) protected db: NodePgDatabase<typeof relations>,
    protected readonly table: TTable,
    private readonly tableName: K,
    protected readonly TSelect: TSelect,
    protected readonly TInsert: TInsert,
  ) {}

  async findAll(): Promise<TSelect[]> {
    const query = this.db.query[this.tableName];
    return (await query.findMany()) as TSelect[];
  }

  async findById(id: number): Promise<TSelect | null> {
    const query = this.db.query[this.tableName];
    const result = await query.findFirst();

    if (!result) {
      throw new NotFoundException(`Record with id ${id} not found`);
    }

    return result as TSelect;
  }

  async create(data: TInsert): Promise<TSelect> {
    const [result] = await this.db
      .insert(this.table)
      .values([...data])
      .returning();
    return result as TSelect;
  }
}
