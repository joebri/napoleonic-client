import type { Config } from 'jest';

const config: Config = {
  collectCoverage: true,
  collectCoverageFrom: [
    // '<rootDir>/src/**',
    // 'src/components/**',
    'src/components/FilterDrawer/*',
    // 'src/hooks/**',
    // 'src/pages/**',
  ],
  coverageReporters: ['text-summary', 'text', 'html'],
  // coverageThreshold: {
  //   global: {
  //     branches: 20,
  //     functions: 20,
  //     lines: 20,
  //     statements: -90,
  //   },
  //   'src/components/**': {
  //     branches: 95,
  //     statements: 95,
  //   },
  // },
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  moduleNameMapper: {
    '^.+\\.(css|scss)$': 'identity-obj-proxy',
  },

  preset: 'ts-jest',
  reporters: [
    'default',
    [
      './node_modules/jest-html-reporter',
      {
        pageTitle: 'Test Summary Report',
      },
    ],
  ],
  roots: ['./src'],
  setupFilesAfterEnv: ['./src/setupTests.ts'],
  testEnvironment: 'jsdom',
  testRegex: '.test.(ts|tsx?)$',
  transform: { '^.+\\.ts?$': 'ts-jest' },
  verbose: true,
};

export default config;
