import { config } from "dotenv";

config({ path: [".env.local", ".env"], quiet: true });
await import("../build/index.js");
