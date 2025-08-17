import { Hono } from "only/server";
import { serve } from "only/server/node";

const app = new Hono();

app.get("/", (c) => c.text("Hello World!"));

serve(app, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
  console.log("Press Ctrl+C to stop the server.");
});
