/// <reference lib="deno.ns" />
import { assertEquals } from "@std/assert";

Deno.test("basic - environment is configured correctly", () => {
  assertEquals(typeof Deno, "object");
  assertEquals(Deno.env.get("DENO_DEPLOYMENT_ID") || "local", "local");
});
