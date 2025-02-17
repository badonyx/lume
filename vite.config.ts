import react from '@vitejs/plugin-react-swc';
//import million from 'million/compiler';
import { defineConfig } from 'vite';
import viteTsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [/*million.vite({ auto: true, mute: true }),*/ react(), viteTsconfigPaths()],
  envPrefix: ['VITE_', 'TAURI_'],
  build: {
    target: process.env.TAURI_PLATFORM === 'windows' ? 'chrome105' : 'safari13',
    minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    sourcemap: !!process.env.TAURI_DEBUG,
  },
  server: {
    strictPort: true,
    port: 3000,
  },
  clearScreen: false,
});
