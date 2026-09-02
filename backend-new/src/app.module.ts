import { Module } from '@nestjs/common';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { DbModule } from './db/db.module.js';
import { FollowedModule } from './followed/followed.module.js';
import { PostItemModule } from './post-item/post-item.module.js';
import { WatchedModule } from './watched/watched.module.js';
import { WebsiteModule } from './website/website.module.js';
import { auth } from './lib/auth.js';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';
import { BaseServiceModule } from './base-service/base-service.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
    BaseServiceModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
  ],
})
export class AppModule {}
