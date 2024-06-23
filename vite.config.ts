/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

console.log(__dirname);

export default defineConfig({
    base: '',
    plugins: [eslint(), react(), viteTsconfigPaths()],

    resolve: {
        alias: {
            '@components': path.join(__dirname, './src/components'),
            '@enums': path.join(__dirname, './src/enums'),
            '@hooks': path.join(__dirname, './src/hooks'),
            '@pages': path.join(__dirname, './src/pages'),
            '@public': path.join(__dirname, './public'),
            '@types': path.join(__dirname, './src/types'),
            '@utils': path.join(__dirname, './src/utils'),
        },
    },
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
