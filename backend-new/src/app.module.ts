import { Module } from '@nestjs/common';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { DbModule } from './db/db.module.js';
import { FollowedModule } from './followed/followed.module.js';
import { PostItemModule } from './post-item/post-item.module.js';
import { WatchedModule } from './watched/watched.module.js';
import { WebsiteModule } from './website/website.module.js';
import { auth } from './lib/auth.js';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './lib/Filters/http-exception.filter.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/Better auth/user.entities.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.MYDB_URI,
      port: process.env.MYDB_PORT ? parseInt(process.env.MYDB_PORT) : undefined,
      username: process.env.MYDB_USERNAME,
      password: process.env.MYDB_PASSWORD,
      database: process.env.MYDB_DATABASENAME,
      entities: [],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      path: '/graphql',
    }),
    AuthModule.forRoot({ auth }),
    WebsiteModule,
    FollowedModule,
    PostItemModule,
    WatchedModule,
    DbModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
