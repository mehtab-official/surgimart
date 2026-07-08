import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^nanoid$': '<rootDir>/node_modules/nanoid/index.cjs',
    '^@sanity/client$': '<rootDir>/node_modules/@sanity/client/dist/index.browser.cjs',
    'server-only': '<rootDir>/__mocks__/server-only.ts',
    '^next/headers$': '<rootDir>/__mocks__/next-headers.ts',
    '^next/cache$': '<rootDir>/__mocks__/next-cache.ts',
  },
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!**/*.d.ts', '!**/node_modules/**'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/', 
    '<rootDir>/.next/', 
    '<rootDir>/tests/',
    '<rootDir>/__tests__/__mocks__/'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(next-auth|@auth|msw|@mswjs|until-async|undici|@bundled-es-modules|@sanity|nanoid)/)',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: { jsx: 'react-jsx' },
    }],
  },
  coverageThreshold: {
    global: { lines: 0.1, functions: 0.1, branches: 0.1 },
  },
}

export default createJestConfig(config)
