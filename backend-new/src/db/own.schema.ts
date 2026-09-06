import {
  pgTable,
  text,
  timestamp,
  index,
  check,
  uuid,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { user } from './auth.schema.js';

// ============================================================================
// TABLES
// ============================================================================

export const websites = pgTable('Websites', {
  id: uuid('Id').primaryKey().defaultRandom(),
  siteName: text('SiteName').notNull().unique(),
  rssUrl: text('RSSUrl').notNull(),
  siteUrl: text('SiteUrl').notNull(),
  createdAt: timestamp('CreatedAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
  description: text('Description'),
  imageUrl: text('ImageUrl'),
});

export const followed = pgTable(
  'Followed',
  {
    id: uuid('Id').primaryKey().defaultRandom(),
    userId: text('UserId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    websiteId: uuid('WebsiteId')
      .notNull()
      .references(() => websites.id, { onDelete: 'cascade' }),
  },
  (table) => [
    index('IX_Followed_UserId').on(table.userId),
    index('IX_Followed_WebsiteId').on(table.websiteId),
  ],
);

export const postItems = pgTable(
  'PostItems',
  {
    id: uuid('Id').primaryKey().defaultRandom(),
    title: text('Title').notNull(),
    description: text('Description'),
    link: text('Link').notNull(),
    imageUrl: text('ImageUrl'),
    publicationDate: timestamp('PublicationDate', {
      withTimezone: true,
    }).notNull(),
    websiteId: uuid('WebsiteId')
      .notNull()
      .references(() => websites.id, { onDelete: 'cascade' }),
    postId: text('PostId').notNull().default(''),
  },
  (table) => [
    index('IX_PostItems_WebsiteId').on(table.websiteId),
    check(
      'CK_PostItems_PublicationDate_NotInFuture',
      sql`${table.publicationDate} <= CURRENT_TIMESTAMP`,
    ),
  ],
);

export const watched = pgTable(
  'Watched',
  {
    id: uuid('Id').primaryKey().defaultRandom(),
    userId: text('UserId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    postItemId: uuid('PostItemId')
      .notNull()
      .references(() => postItems.id, { onDelete: 'cascade' }),
  },
  (table) => [
    index('IX_Watched_PostItemId').on(table.postItemId),
    index('IX_Watched_UserId').on(table.userId),
  ],
);
