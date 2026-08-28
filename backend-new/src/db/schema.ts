import { defineRelations } from 'drizzle-orm';
import { account, session, user, verification } from './auth.schema.js';
import { websites, followed, postItems, watched } from './own.Schema.js';

export const relations = defineRelations(
  {
    account,
    session,
    user,
    verification,
    websites,
    followed,
    postItems,
    watched,
  },
  (relations) => ({
    user: {
      sessions: relations.many.session(),
      accounts: relations.many.account(),
    },
    session: {
      user: relations.one.user({
        from: relations.session.userId,
        to: relations.user.id,
      }),
    },
    account: {
      user: relations.one.user({
        from: relations.account.userId,
        to: relations.user.id,
      }),
    },
    followed: {
      user: relations.one.user({
        from: relations.followed.userId,
        to: relations.user.id,
      }),
      website: relations.one.websites({
        from: relations.followed.websiteId,
        to: relations.websites.id,
      }),
    },
    postItems: {
      website: relations.one.websites({
        from: relations.postItems.websiteId,
        to: relations.websites.id,
      }),
    },
    watched: {
      user: relations.one.user({
        from: relations.watched.userId,
        to: relations.user.id,
      }),
      postItem: relations.one.postItems({
        from: relations.watched.postItemId,
        to: relations.postItems.id,
      }),
    },
  }),
);

export const schema = {
  user,
  session,
  account,
  verification,
  websites,
  followed,
  postItems,
  watched,
};
