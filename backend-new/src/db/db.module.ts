import { Global, Module } from '@nestjs/common';
import db from 'src/lib/db';

export const DRIZZLE = 'DRIZZLE_CLIENT';

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE,
      useFactory: () => db,
    },
  ],
  exports: [DRIZZLE],
})
export class DbModule {}
