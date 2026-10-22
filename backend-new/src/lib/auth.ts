import { betterAuth } from 'better-auth';
import { Pool } from 'pg';

import * as dotenv from 'dotenv';

// Laddar .env-filen om du kör CLI fristående
dotenv.config();

const pool = new Pool({
  connectionString: process.env.MYDB_URI,
});

export const auth = betterAuth({
  baseURL: process.env.betterAuth_BASE_URL || 'http://localhost:3000',
  database: pool,
  emailAndPassword: {
    enabled: true,
  },
});
