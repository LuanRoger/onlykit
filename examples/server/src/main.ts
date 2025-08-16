import { Hono } from "only/server";
import { serve } from "only/server/node";

const app = new Hono();

app.get("/", (c) => c.text("Hello World!"));

serve(app);
