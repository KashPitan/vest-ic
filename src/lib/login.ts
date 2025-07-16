"use server";
import { hash, verify } from "@node-rs/argon2";
import { eq } from "drizzle-orm";
import { lucia } from "@/lib/auth";
import db from "@/drizzle.server";
import { redirect } from "next/navigation";
import { cookies as getCookies } from "next/headers";
import { users } from "@/db/schema/users";
import { validateRequest } from "./validateRequest";

export async function login(formData: FormData) {
  const username = formData.get("username");
  // username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
  // keep in mind some database (e.g. mysql) are case insensitive
  if (
    typeof username !== "string" ||
    username.length < 3 ||
    username.length > 31 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    return {
      error: "Invalid username",
    };
  }
  const password = formData.get("password");
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return {
      error: "Invalid password",
    };
  }

  const result = await db
    .select()
    .from(users)
    .limit(1)
    .where(eq(users.username, username.toLowerCase()));
  const [existingUser] = result;
  if (!existingUser) {
    return {
      error: "Incorrect username or password",
    };
  }

  const validPassword = await verify(existingUser.passwordHash, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  if (!validPassword) {
    return {
      error: "Incorrect username or password",
    };
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  const cookies = await getCookies();
  cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect("/");
}

export const signup = async (formData: FormData) => {
  const username = formData.get("username");
  // username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
  // keep in mind some database (e.g. mysql) are case insensitive
  if (
    typeof username !== "string" ||
    username.length < 3 ||
    username.length > 31 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    return {
      error: "Invalid username",
    };
  }
  const password = formData.get("password");
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return {
      error: "Invalid password",
    };
  }
  const result = await db
    .select()
    .from(users)
    .limit(1)
    .where(eq(users.username, username.toLowerCase()));
  const [existingUser] = result;
  if (!existingUser) {
    return {
      error: "User does not exist",
    };
  }
  const passwordHash = await hash(password, {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  const [{ id: userId }] = await db
    .insert(users)
    .values({
      username: username.toLowerCase(),
      passwordHash: passwordHash,
    })
    .returning({ id: users.id });
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  const cookies = await getCookies();
  cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect("/login");
};

export const logout = async () => {
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  const cookies = await getCookies();
  cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect("/login");
};
