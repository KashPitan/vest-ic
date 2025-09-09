import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getUserRole = async (userId: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { role: true },
  });

  return user?.role || null;
};
