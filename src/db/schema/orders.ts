import { createId } from "@paralleldrive/cuid2";
import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { restaurants } from "./restaurants";
import { users } from "./users";

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "processing",
  "delivering",
  "delivered",
  "canceled",
]);

export const orders = pgTable("orders", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  customerId: text("customer_id").references(() => users.id, {
    onDelete: "set null",
  }),
  restaurantId: text("restaurant_id")
    .notNull()
    .references(() => restaurants.id, {
      onDelete: "cascade",
    }),
  status: orderStatusEnum("status").notNull().default("pending"),
  totalInCents: integer("total_in_cents").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});
