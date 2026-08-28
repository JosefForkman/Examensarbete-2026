import 'dotenv/config';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';
import { relations } from '../db/schema.js';

export type DrizzleDb = NodePgDatabase<typeof relations>;

export default (configService: ConfigService) => {
  const connectionString = configService.get<string>('DATABASE_URL');

  const client = new Pool({ connectionString });

  const db = drizzle({ client, relations });
  return db;
};
