import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const fundDataAudit = pgTable("fund_data_audit", {
  id: uuid("id").primaryKey().defaultRandom(),
  filename: text("filename").notNull(),
  uploadDate: timestamp("upload_date").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type FundDataAudit = typeof fundDataAudit.$inferSelect;
export type NewFundDataAudit = typeof fundDataAudit.$inferInsert;
