import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  client: "@hey-api/client-fetch",
  input: "http://127.0.0.1:8000/openapi.json",
  output: "app/client",
  plugins: ["@tanstack/react-query"],
});
