import { Elysia } from "elysia";
import { authenticateFromLinkRoute } from "./routes/authenticate-from-link-route";
import { registerRestaurantRoute } from "./routes/register-restaurant-route";
import { sendAuthLinkRoute } from "./routes/send-auth-link-route";
import { signOutRoute } from "./routes/sign-out-route";

export const app = new Elysia()
  .use(registerRestaurantRoute)
  .use(sendAuthLinkRoute)
  .use(authenticateFromLinkRoute)
  .use(signOutRoute);

app.get("/health", () => "OK");

app.listen(3333, () => {
  console.log("Server is running on http://localhost:3333");
});
