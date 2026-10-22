// Astro config: static site + Tailwind v4 via Vite plugin
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Inline the (small) CSS into the HTML so it does not block the first paint
  build: { inlineStylesheets: 'always' },
  vite: {
    plugins: [tailwindcss()],
    // Never inline page scripts: our Content-Security-Policy (worker/index.ts) only allows script files from 'self'.
    // CSS is still inlined by inlineStylesheets: 'always' above.
    build: { assetsInlineLimit: 0 },
  },
});
