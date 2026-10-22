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
import { Website } from './entities/website.entities.js';
import { Watched } from './entities/watched.entities.js';
import { PostItems } from './entities/PostItems.entities.js';
import { Followed } from './entities/followed.entities.js';
import { User } from './entities/Better auth/user.entities.js';
import { Session } from './entities/Better auth/session.entities.js';
import { Account } from './entities/Better auth/account.entities.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          type: 'postgres',
          url: configService.get<string>('MYDB_URI'),
          entities: [
            Followed,
            PostItems,
            Watched,
            Website,
            User,
            Session,
            Account,
          ],
          synchronize: false, // Set to false in production
        };
      },
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
