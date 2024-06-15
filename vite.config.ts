/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import viteTsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    base: '',
    plugins: [eslint(), react(), viteTsconfigPaths()],

    server: {
        // this ensures that the browser opens upon server start
        open: true,
        // this sets a default port to 3000
        port: 3000,
    },
    test: {
        coverage: {
            include: ['src/components/', 'src/pages/'],
            provider: 'v8',
            reporter: ['json', 'html', 'text'],
        },
        environment: 'jsdom',
        // globals: true,
        include: ['src/**/*.test.tsx'],
        setupFiles: './src/setupTests.ts',
    },
});
