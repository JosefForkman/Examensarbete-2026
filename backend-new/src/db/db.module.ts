import { Global, Module } from '@nestjs/common';
import db from '../lib/db.js';
import { ConfigService } from '@nestjs/config';

export const DRIZZLE = Symbol('DRIZZLE_CLIENT');

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE,
      useFactory: db,
      inject: [ConfigService],
    },
  ],
  exports: [DRIZZLE],
})
export class DbModule {}
