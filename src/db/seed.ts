import { faker } from "@faker-js/faker";
import chalk from "chalk";
import { db } from "./connection";
import { restaurants, users } from "./schema/index";

/**
 * Reset database
 */
await db.delete(users);
await db.delete(restaurants);

console.log(chalk.yellow("Database reset complete."));

/**
 * Create fake customers
 */
await db.insert(users).values(
  Array.from({ length: 10 }).map(() => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
  }))
);

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
await db.insert(restaurants).values(
  Array.from({ length: 5 }).map(() => ({
    name: faker.company.name(),
    description: faker.company.catchPhrase(),
    managerId: manager?.id,
  }))
);

console.log(chalk.magenta("Created fake restaurants."));

console.log(chalk.blue("Database seeding complete."));

process.exit();
