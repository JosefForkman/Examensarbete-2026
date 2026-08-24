import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { WebsiteModule } from './website/website.module';
import { FollowedModule } from './followed/followed.module';
import { PostItemModule } from './post-item/post-item.module';
import { WatchedModule } from './watched/watched.module';
import { DbModule } from './db/db.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      path: '/graphql',
    }),
    WebsiteModule,
    FollowedModule,
    PostItemModule,
    WatchedModule,
    DbModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
