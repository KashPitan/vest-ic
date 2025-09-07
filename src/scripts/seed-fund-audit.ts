import "dotenv/config";
import { db } from "@/db";
import { fundDataAudit } from "@/db/schema";

async function main() {
  const filename = "FundData_01092025.xlsm";
  await db.insert(fundDataAudit).values({
    filename,
    uploadDate: new Date(),
  });
  console.log("Seeded fundDataAudit with", filename);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
