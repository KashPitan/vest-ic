import type {Config} from 'jest';
import nextJest from 'next/jest.js';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json'

const createJestConfig = nextJest({
  dir: './',
})

const config: Config = {
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  clearMocks: true,
  coverageProvider: "v8",
  testEnvironment: "node",// "jsdom",
  preset: 'ts-jest',
  roots: ['<rootDir>'],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  // ...createDefaultEsmPreset(),
  transform: {
    '^.+\\.ts?$': 'ts-jest',
    },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  // {
  //   '^@/(.*)$': '<rootDir>/src/$1',
  //   "^@payload-config$": '<rootDir>/src/payload.config.ts'
  // }
};

export default createJestConfig(config)
