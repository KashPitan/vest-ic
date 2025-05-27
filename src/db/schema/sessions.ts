import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const sessions = pgTable("session", {
	id: uuid("id").primaryKey(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date"
	}).notNull()
});