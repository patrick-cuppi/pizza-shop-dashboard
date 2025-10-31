import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { orders } from "./orders";
import { restaurants } from "./restaurants";

export const userRoleEnum = pgEnum("user_role", ["manager", "customer"]);

export const users = pgTable("users", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  role: userRoleEnum("role").notNull().default("customer"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const userRelations = relations(users, ({ one, many }) => {
  return {
    managedRestaurant: one(restaurants, {
      fields: [users.id],
      references: [restaurants.managerId],
      relationName: "managed_restaurant",
    }),
    orders: many(orders),
  };
});