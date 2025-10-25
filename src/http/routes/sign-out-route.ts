import Elysia from "elysia";
import { auth } from "../auth";

export const signOutRoute = new Elysia()
  .use(auth)
  .post("/sign-out", async ({ cookie, cookie: { auth } }) => {
    auth?.remove();

    delete cookie.auth;
  });
