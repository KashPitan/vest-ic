import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
import { posts } from "./posts";
import { tags } from "./tags";
import { relations } from "drizzle-orm";

export const postTags = pgTable("post_tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  tagId: uuid("tag_id")
    .notNull()
    .references(() => tags.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(posts, {
    fields: [postTags.postId],
    references: [posts.id],
  }),
}));

export const postTagsTagRelations = relations(postTags, ({ one }) => ({
  tag: one(tags, {
    fields: [postTags.tagId],
    references: [tags.id],
  }),
}));

export type PostTag = typeof postTags.$inferSelect;
export type NewPostTag = typeof postTags.$inferInsert;
