import { babel } from '@rollup/plugin-babel';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    babel({ extensions: ['.ts', '.tsx'], babelHelpers: 'bundled', skipPreflightCheck: true }),
  ],
  resolve: {
    alias: [
      {
        find: '~',
        replacement: '/src',
      },
    ],
  },
});
