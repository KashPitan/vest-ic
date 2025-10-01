import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const UserRole = {
  Admin: "admin",
  User: "user",
} as const;

type EKey = keyof typeof UserRole;
export type UserRoleValues = (typeof UserRole)[EKey];

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text({ enum: Object.values(UserRole) as [UserRoleValues] }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
