/* eslint-disable drizzle/enforce-delete-with-where */

import { faker } from "@faker-js/faker";
import chalk from "chalk";
import { db } from "./connection";
import {
  authLinks,
  orderItems,
  orders,
  products,
  restaurants,
  users,
} from "./schema/index";
import { createId } from "@paralleldrive/cuid2";

/**
 * Reset database
 */
await db.delete(users);
await db.delete(restaurants);
await db.delete(orderItems);
await db.delete(orders);
await db.delete(products);
await db.delete(authLinks);

console.log(chalk.yellow("Database reset complete."));

/**
 * Create fake customers
 */
const [customer] = await db
  .insert(users)
  .values(
    Array.from({ length: 10 }).map(() => ({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
    }))
  )
  .returning();

console.log(chalk.green("Created fake customers."));

/**
 * Create fake manager
 */
const [manager] = await db
  .insert(users)
  .values([
    {
      name: faker.person.fullName(),
      email: "admin@admin.com",
      phone: faker.phone.number(),
      role: "manager",
    },
  ])
  .returning({
    id: users.id,
  });

console.log(chalk.green("Created fake manager."));

/**
 * Create fake restaurants
 */
const [restaurant] = await db
  .insert(restaurants)
  .values(
    Array.from({ length: 5 }).map(() => ({
      name: faker.company.name(),
      description: faker.company.catchPhrase(),
      managerId: manager?.id,
    }))
  )
  .returning();

console.log(chalk.magenta("Created fake restaurants."));

/**
 * Create fake products
 */

const availableProducts = await db
  .insert(products)
  .values(
    Array.from({ length: 20 }).map(() => ({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      priceInCents: Math.round(
        Number(faker.commerce.price({ min: 5, max: 50 })) * 100
      ),
      restaurantId: restaurant!.id,
    }))
  )
  .returning();

console.log(chalk.cyan("Created fake products."));

/**
 * Create fake orders
 */
type OrderItemDataProps = typeof orderItems.$inferInsert;
type OrderInsertProps = typeof orders.$inferInsert;

const orderItemsData: OrderItemDataProps[] = [];
const orderData: OrderInsertProps[] = [];

for (let i = 0; i < 200; i++) {
  const orderId = createId();

  const orderProducts = faker.helpers.arrayElements(availableProducts, {
    min: 1,
    max: 3,
  });

  let totalInCents = 0;

  orderProducts.forEach((orderProduct) => {
    const quantity = faker.number.int({ min: 1, max: 3 });
    totalInCents += orderProduct.priceInCents * quantity;

    orderItemsData.push({
      orderId,
      productId: orderProduct.id,
      quantity,
      priceInCents: totalInCents,
    });
  });

  orderData.push({
    id: orderId,
    customerId: faker.helpers.arrayElement([customer!.id]),
    restaurantId: restaurant!.id,
    totalInCents,
    status: faker.helpers.arrayElement([
      "pending",
      "processing",
      "delivering",
      "delivered",
      "canceled",
    ]),
    created_at: faker.date.recent({ days: 40 }),
  });
}

await db.insert(orders).values(orderData);
await db.insert(orderItems).values(orderItemsData);

console.log(chalk.red("Created fake order items."));

console.log(chalk.blue("Database seeding complete."));

process.exit();
