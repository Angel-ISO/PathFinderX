module.exports = {
  testEnvironment: 'node',
  transform: {},
  
  testMatch: [
    '**/test/**/*.test.js'
  ],

  setupFiles: [
    '<rootDir>/test/setupEnv.js'
  ],

    detectOpenHandles: true,
  forceExit: false, 
  
  collectCoverageFrom: [
    'api/**/*.js',
    'core/**/*.js',
    'Infrastructure/**/*.js',
    'shared/**/*.js',
    '!**/test/**',
    '!**/node_modules/**',
    '!server.js',
    '!Infrastructure/init/init.js',
    '!api/app.js'
  ],
  
  roots: ['<rootDir>'],

  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html']
};