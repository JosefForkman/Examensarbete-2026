import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '../db/db.module.js';
import { relations } from '../db/schema.js';
import { BaseServiceService } from 'src/base-service/base-service.service';

@Injectable()
export class WebsiteService extends BaseServiceService<'websites'> {
  constructor(@Inject(DRIZZLE) db: NodePgDatabase<typeof relations>) {
    super(db, 'websites');
  }
}
