import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { postTags } from "./postTags";
import { relations } from "drizzle-orm";

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  releaseDate: timestamp("release_date"),
  displayImageUrl: text("display_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const postTagsPostRelations = relations(posts, ({ many }) => ({
  postTags: many(postTags),
}));

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
