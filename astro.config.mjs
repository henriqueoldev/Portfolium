// @ts-check
import { defineConfig, envField } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import netlify from "@astrojs/netlify";

// `@netlify/vite-plugin` emulates Netlify locally (blobs, edge functions, ...).
// Its bundled edge runtime passes `--allow-scripts` to `deno`, which Deno 2.x
// rejects, so `astro dev` dies with an unhandled rejection.
// The plugin skips its emulation when NETLIFY_DEV is set, which is what
// `netlify dev` does. The site needs none of those emulated features locally.
if (process.argv.includes("dev")) {
  process.env.NETLIFY_DEV = "1";
}

// https://astro.build/config
export default defineConfig({
  vite: {
    // The Tailwind plugin is typed against a different Vite copy than Astro's.
    // @ts-expect-error duplicate Vite typings
    plugins: [tailwindcss()],
  },

  integrations: [react()],

  // Required by the server island that renders the GitHub section.
  adapter: netlify(),

  env: {
    schema: {
      // Optional: the GitHub API also works unauthenticated (60 req/h).
      GITHUB_API_KEY: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
    },
  },
});
