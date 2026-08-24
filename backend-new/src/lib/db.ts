import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';
import { Pool } from 'pg';

const client = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

const db = drizzle({ client, relations: schema });

export type DB = typeof db;

export default db;
