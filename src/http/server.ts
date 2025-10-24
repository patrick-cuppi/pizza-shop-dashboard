import { Elysia, t } from "elysia";
import { registerRestaurantRoute } from "./routes/register-restaurant-route";
import { sendAuthLinkRoute } from "./routes/send-auth-link-route";
import jwt from "@elysiajs/jwt";
import { env } from "../env";
import cookie from "@elysiajs/cookie";

const app = new Elysia()
  .use(
    jwt({
      secret: env.JWT_SECRET,
      schema: t.Object({
        sub: t.String(),
        restaurantId: t.Optional(t.String()),
      }),
    })
  )
  .use(cookie())
  .use(registerRestaurantRoute)
  .use(sendAuthLinkRoute);

app.get("/health", () => "OK");

app.listen(3333, () => {
  console.log("Server is running on http://localhost:3333");
});
