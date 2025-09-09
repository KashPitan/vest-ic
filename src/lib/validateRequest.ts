import { cookies as getCookies } from "next/headers";
import { cache } from "react";
import type { Session, User } from "lucia";
import { lucia } from "@/lib/auth";
import { UserRole } from "@/db/schema";
import { getUserRole } from "@/data-access-layer/users";

class UserNotAuthenticatedError extends Error {
  constructor() {
    super("USER IS NOT AUTHENTICATED");
  }
}

export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const cookies = await getCookies();
    const sessionId = cookies.get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);
    // next.js throws when you attempt to set cookie when rendering page
    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies.set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies.set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
    } catch {}
    return result;
  },
);

export const isLoggedIn = async () => {
  const { session } = await validateRequest();
  return Boolean(session);
};

export const isAdmin = async (userId: string): Promise<boolean> => {
  // Get the user's role from the database
  const userRole = await getUserRole(userId);

  if (!userRole) {
    throw new UserNotAuthenticatedError();
  }

  return userRole === UserRole.Admin;
};

export const isAdminFromSession = async () => {
  const { user, session } = await validateRequest();

  if (!session || !user) {
    return false;
  }

  const isAdminRole = await isAdmin(user.id);

  if (!isAdminRole) {
    return false;
  }
};
