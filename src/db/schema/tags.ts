import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";

export const tags = pgTable("tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  tagName: text("tag_name").notNull(),
  category: text("category")
    .notNull()
    .$type<"Cat1" | "Cat2" | "Cat3" | "Cat4">(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
