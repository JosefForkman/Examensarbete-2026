import {
  pgTable,
  text,
  integer,
  timestamp,
  index,
  check,
  serial,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { user } from './auth.schema.js';

// ============================================================================
// TABLES
// ============================================================================

export const websites = pgTable('Websites', {
  id: serial('Id').primaryKey(),
  siteName: text('SiteName').notNull(),
  rssUrl: text('RSSUrl').notNull(),
  siteUrl: text('SiteUrl').notNull(),
  createdAt: timestamp('CreatedAt', { withTimezone: true })
    .notNull()
    .default(sql`TIMESTAMPTZ '-infinity'`),
  description: text('Description'),
  imageUrl: text('ImageUrl'),
});

export const followed = pgTable(
  'Followed',
  {
    id: serial('Id').primaryKey(),
    userId: text('UserId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    websiteId: integer('WebsiteId')
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
    id: serial('Id').primaryKey(),
    title: text('Title').notNull(),
    description: text('Description'),
    link: text('Link').notNull(),
    imageUrl: text('ImageUrl'),
    publicationDate: timestamp('PublicationDate', {
      withTimezone: true,
    }).notNull(),
    websiteId: integer('WebsiteId')
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
    id: serial('Id').primaryKey(),
    userId: text('UserId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    postItemId: integer('PostItemId')
      .notNull()
      .references(() => postItems.id, { onDelete: 'cascade' }),
  },
  (table) => [
    index('IX_Watched_PostItemId').on(table.postItemId),
    index('IX_Watched_UserId').on(table.userId),
  ],
);
