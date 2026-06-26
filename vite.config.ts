/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import path from 'path';

export default defineConfig({
    base: '',
    plugins: [react()],

    resolve: {
        alias: {
            '@components': path.join(__dirname, './src/components'),
            '@enums': path.join(__dirname, './src/enums'),
            '@hooks': path.join(__dirname, './src/hooks'),
            '@models': path.join(__dirname, './src/models'),
            '@pages': path.join(__dirname, './src/pages'),
            '@providers': path.join(__dirname, './src/providers'),
            '@public': path.join(__dirname, './public'),
            '@state': path.join(__dirname, './src/state'),
            '@utilities': path.join(__dirname, './src/utilities'),
        },
        tsconfigPaths: true,
    },
    server: {
        // this ensures that the browser opens upon server start
        open: '/gallery',
        // this sets a default port to 3000
        port: 3000,
    },
    // test: {
    //     coverage: {
    //         include: ['src/components/', 'src/pages/'],
    //         provider: 'v8',
    //         reporter: ['json', 'html', 'text'],
    //     },
    //     environment: 'jsdom',
    //     // globals: true,
    //     include: ['src/**/*.test.tsx'],

    //     setupFiles: './src/setupTests.ts',
    // },
});
