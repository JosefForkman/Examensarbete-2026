import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { betterAuth } from 'better-auth/minimal';
import db from './db.js';
export const auth = betterAuth({
  baseURL: process.env.betterAuth_BASE_URL || 'http://localhost:3000',
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
  },
});
