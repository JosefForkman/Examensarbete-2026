import { User } from 'src/entities/Better auth/user.entities';
import { Session } from 'src/entities/Better auth/session.entities';
import { Followed } from 'src/entities/followed.entities';
import { PostItems } from 'src/entities/PostItems.entities';
import { Watched } from 'src/entities/watched.entities';
import { Website } from 'src/entities/website.entities';
import { Account } from 'src/entities/Better auth/account.entities';
import { Verification } from 'src/entities/Better auth/verification.entities';
import { DataSource, DataSourceOptions } from 'typeorm';

export const typeormOptions = (url?: string) =>
  ({
    type: 'postgres',
    url,
    // This is not working in nestjs app.module.ts
    // migrations: [
    //   'dist/typeorm/migrations/*.js',
    //   './src/typeorm/migrations/*.ts',
    // ],
    entities: [
      Followed,
      PostItems,
      Watched,
      Website,
      User,
      Session,
      Account,
      Verification,
    ],
    synchronize: false, // Set to false in production
  }) satisfies DataSourceOptions;

const databaseConnectionString = process.env.MYDB_URI;
export const AppDataSource = new DataSource(
  typeormOptions(databaseConnectionString),
);
