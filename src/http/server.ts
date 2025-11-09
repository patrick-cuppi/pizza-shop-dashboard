import { Elysia } from "elysia";
import { authenticateFromLinkRoute } from "./routes/authenticate-from-link-route";
import { registerRestaurantRoute } from "./routes/register-restaurant-route";
import { sendAuthLinkRoute } from "./routes/send-auth-link-route";
import { signOutRoute } from "./routes/sign-out-route";
import { getProfileRoute } from "./routes/get-profile-route";
import { getManagedRestaurantRoute } from "./routes/get-managed-restaurant-route";
import { getOrdersDetailsRoute } from "./routes/get-orders-details-route";
import { approveOrderRoute } from "./routes/approve-order-route";
import { dispatchOrderRoute } from "./routes/dispatch-order-route";
import { deliverOrderRoute } from "./routes/deliver-order-route";
import { cancelOrderRoute } from "./routes/cancel-order-route";
import { getOrdersRoute } from "./routes/get-orders-route";

export const app = new Elysia()
  .use(registerRestaurantRoute)
  .use(sendAuthLinkRoute)
  .use(authenticateFromLinkRoute)
  .use(signOutRoute)
  .use(getProfileRoute)
  .use(getManagedRestaurantRoute)
  .use(getOrdersDetailsRoute)
  .use(approveOrderRoute)
  .use(dispatchOrderRoute)
  .use(deliverOrderRoute)
  .use(cancelOrderRoute)
  .use(getOrdersRoute)
  .onError(({ code, error, set }) => {
    switch (code) {
      case "VALIDATION": {
        set.status = error.status;
        return error.toResponse();
      }
      default: {
        set.status = 500;
        return new Response(null, { status: 500 });
      }
    }
  });

app.get("/health", () => "OK");

app.listen(3333, () => {
  console.log("Server is running on http://localhost:3333");
});
