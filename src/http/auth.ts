import jwt from "@elysiajs/jwt";
import Elysia, { t, type Static } from "elysia";
import { env } from "../env";

const jwtPayload = t.Object({
  sub: t.String(),
  restaurantId: t.Optional(t.String()),
});

export const auth = new Elysia()
  .use(
    jwt({
      secret: env.JWT_SECRET,
      schema: jwtPayload,
    })
  )
  .derive({ as: "scoped" }, ({ jwt, cookie: { auth } }) => {
    return {
      signUser: async (payload: Static<typeof jwtPayload>) => {
        const token = await jwt.sign(payload);

        if (!auth) throw new Error("Missing auth cookie");

        auth.value = token;
        auth.httpOnly = true;
        auth.maxAge = 60 * 60 * 24 * 7; // 7 days
        auth.path = "/";
      },

      signOut: async () => {
        if (!auth) throw new Error("Missing auth cookie");
        auth.remove();
      },

      getCurrentUser: async () => {
        const authCookie = auth?.value as string;

        const payload = await jwt.verify(authCookie);
        if (!payload) throw new Error("Invalid auth token");

        return {
          userId: payload.sub,
          restaurantId: payload.restaurantId,
        };
      },
    };
  });
