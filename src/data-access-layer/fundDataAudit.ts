import { db } from "@/db";
import { fundDataAudit, type NewFundDataAudit } from "@/db/schema";

export async function createFundDataAuditRecord(data: NewFundDataAudit) {
  try {
    const result = await db.insert(fundDataAudit).values(data).returning();
    return { success: true, data: result[0] };
  } catch (error) {
    console.error("Error creating fund data audit record:", error);
    return { success: false, error: "Failed to create audit record" };
  }
}

export async function getFundDataAuditRecords() {
  try {
    const records = await db
      .select()
      .from(fundDataAudit)
      .orderBy(fundDataAudit.uploadDate);
    return { success: true, data: records };
  } catch (error) {
    console.error("Error fetching fund data audit records:", error);
    return { success: false, error: "Failed to fetch audit records" };
  }
}
