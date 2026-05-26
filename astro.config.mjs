import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://new-portfolio.pages.dev',
  integrations: [react(), mdx()],

  vite: {
    plugins: [tailwindcss()],
  },

  experimental: {
    clientPrerender: true,
  },

  adapter: cloudflare(),
});