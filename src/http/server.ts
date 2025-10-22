import { Elysia } from "elysia";

const app = new Elysia().get("/", () => "Hello, Elysia!");

app.listen(3333, () => {
  console.log("Server is running on http://localhost:3333");
});
