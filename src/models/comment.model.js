import { posts } from '#models/post.model.js';
import { users } from '#models/user.model.js';
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  postId: serial('post_id')
    .notNull()
    .references(() => posts.id, { onDelete: 'cascade' }),
  authorId: serial('author_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});
