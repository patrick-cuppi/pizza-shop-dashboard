import dayjs from "dayjs";
import { eq } from "drizzle-orm";
import Elysia, { t } from "elysia";
import { db } from "../../db/connection";
import { authLinks } from "../../db/schema";
import { auth } from "../auth";

export const authenticateFromLinkRoute = new Elysia().use(auth).get(
  "/auth-links/authenticate",
  async ({ query, signUser, redirect }) => {
    const { code, redirect: redirectUrl } = query;

    const authLinkFromCode = await db.query.authLinks.findFirst({
      where(fields, { eq }) {
        return eq(fields.code, code);
      },
    });

    if (!authLinkFromCode)
      throw new Error("Invalid or expired authentication link");

    const daysSinceAuthLinkWasCreated = dayjs().diff(
      authLinkFromCode.createdAt,
      "days"
    );

    if (daysSinceAuthLinkWasCreated > 7)
      throw new Error("Authentication link has expired");

    const managedRestaurant = await db.query.restaurants.findFirst({
      where(fields, { eq }) {
        return eq(fields.managerId, authLinkFromCode.userId);
      },
    });

    await signUser({
      sub: authLinkFromCode.userId,
      restaurantId: managedRestaurant?.id,
    });

    await db.delete(authLinks).where(eq(authLinks.code, code));

    return redirect(redirectUrl, 302);
  },
  {
    query: t.Object({
      code: t.String(),
      redirect: t.String(),
    }),
  }
);
