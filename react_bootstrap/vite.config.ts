import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { config as dotenvConfig } from 'dotenv';
import { createHtmlPlugin } from 'vite-plugin-html';

dotenvConfig();

export default defineConfig({
  plugins: [
    react(),
    createHtmlPlugin({
      inject: {
        data: {
          googleMapsApiKey: process.env.VITE_GOOGLE_MAPS_API_KEY,
        },
      },
    }),
  ],
});
