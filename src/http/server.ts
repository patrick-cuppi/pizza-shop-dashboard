import { Elysia } from "elysia";
import { registerRestaurantRoute } from "./routes/register-restaurant-route";
import { sendAuthLinkRoute } from "./routes/send-auth-link-route";

const app = new Elysia().use(registerRestaurantRoute).use(sendAuthLinkRoute);

app.get("/health", () => "OK");

app.listen(3333, () => {
  console.log("Server is running on http://localhost:3333");
});
