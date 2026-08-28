import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '../db/db.module.js';
import { relations, schema } from '../db/schema.js';
import { eq } from 'drizzle-orm';

@Injectable()
export class WebsiteService {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase<typeof relations>) {}

  async getAll() {
    return await this.db.select().from(schema.websites);
  }

  async getById(id: number) {
    const [website] = await this.db
      .select()
      .from(schema.websites)
      .where(eq(schema.websites.id, id))
      .limit(1);
    return website;
  }
}
