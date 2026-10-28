import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load all env vars (not just VITE_*) so the publishable key can fall back to
  // CLERK_PUBLISHABLE_KEY, which is what the Netlify project defines.
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env };
  const clerkKey = env.VITE_CLERK_PUBLISHABLE_KEY || env.CLERK_PUBLISHABLE_KEY || '';

  return {
    plugins: [react()],
    resolve: { alias: { '@': path.resolve(__dirname, './src') } },
    server: { port: 5173 },
    define: {
      // Publishable keys are safe to expose in the browser bundle.
      'import.meta.env.VITE_CLERK_PUBLISHABLE_KEY': JSON.stringify(clerkKey),
    },
  };
});
