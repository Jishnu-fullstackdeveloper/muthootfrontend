import type { Config } from 'jest'
import nextJest from 'next/jest.js'
// const nextJest = require('next/jest')
const { jest: jestConfig } = require('next/dynamic')
const HtmlReporter = require('jest-html-reporters')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './'
})

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Handle module aliases, adjust this to your project's aliases
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'html'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/node_modules/**',
    '!src/**/vendor/**',
  ],
  // collectCoverageFrom: [
  //   '!src/**/*.d.ts',
  //   '!src/**/node_modules/**',
  //   '!src/**/vendor/**',
  //   'src/views/pages/ResignationAndRecruitment/UnitTesting/RecruitmentOverview.generated.test.tsx'
  // ],
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './html-report',
        filename: 'report.html',
        expand: true
      }
    ]
  ]
}

module.exports = createJestConfig(config)
