import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '../db/db.module.js';
import { relations, schema } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { CreateWebsiteDTO, WebsiteDTO } from './dto/website.js';

@Injectable()
export class WebsiteService {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase<typeof relations>) {}

  async getAll(): Promise<WebsiteDTO[]> {
    return await this.db.select().from(schema.websites);
  }

  async getById(id: number): Promise<WebsiteDTO> {
    const [website] = await this.db
      .select()
      .from(schema.websites)
      .where(eq(schema.websites.id, id))
      .limit(1);
    return website;
  }

  async create(website: CreateWebsiteDTO): Promise<WebsiteDTO> {
    const [createdWebsite] = await this.db
      .insert(schema.websites)
      .values(website)
      .returning();

    return createdWebsite;
  }
}
