import nodeAdapter from "@sveltejs/adapter-node";
import vercelAdapter from "@sveltejs/adapter-vercel";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: process.env.VERCEL === "1" ? vercelAdapter() : nodeAdapter(),
    files: { assets: "public" },
    csp: {
      mode: "auto",
      directives: {
        "default-src": ["self"],
        "script-src": ["self"],
        "style-src": ["self"],
        "style-src-attr": ["none"],
        "img-src": ["self", "data:", "blob:", "https://*.supabase.co"],
        "media-src": ["self", "blob:", "https://*.supabase.co"],
        "font-src": ["self", "data:"],
        "connect-src": ["self", "https://*.supabase.co", "wss://*.supabase.co"],
        "frame-src": ["https://www.youtube-nocookie.com"],
        "object-src": ["none"],
        "base-uri": ["self"],
        "form-action": ["self"],
        "frame-ancestors": ["none"],
        "upgrade-insecure-requests": true,
      },
    },
  },
};

export default config;
